import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { RoadReport, DamageSeverity, ReportStatus } from '../types';

interface PalembangMapProps {
  reports?: RoadReport[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  pickerMode?: boolean;
  selectedCoord?: [number, number] | null;
  onLocationSelect?: (lat: number, lng: number) => void;
  onReportClick?: (report: RoadReport) => void;
  filterDistrict?: string;
  filterSeverity?: string;
}

// Custom Leaflet marker with pin effect
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        background: ${color};
        transform: rotate(-45deg);
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid #ffffff;
      ">
        <div style="
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ffffff;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const getSeverityColor = (severity: DamageSeverity, status: ReportStatus) => {
  if (status === 'Selesai') return '#16a34a'; // Emerald green
  if (status === 'Dalam Perbaikan') return '#2563eb'; // Blue
  if (severity === 'Berat') return '#dc2626'; // Red
  if (severity === 'Sedang') return '#ea580c'; // Orange
  return '#ca8a04'; // Amber
};

export const PalembangMap: React.FC<PalembangMapProps> = ({
  reports = [],
  center = [-2.9761, 104.7573], // Palembang city center near Ampera & Sudirman
  zoom = 13,
  height = '480px',
  pickerMode = false,
  selectedCoord,
  onLocationSelect,
  onReportClick,
  filterDistrict,
  filterSeverity,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Handle map click in picker mode
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (pickerMode && onLocationSelect) {
          const { lat, lng } = e.latlng;
          onLocationSelect(parseFloat(lat.toFixed(6)), parseFloat(lng.toFixed(6)));
        }
      });
    }

    return () => {
      // Map cleanup if unmounting
    };
  }, []);

  // Update center when center prop changes
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center[0], center[1], zoom]);

  // Update report markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    if (pickerMode) return; // Do not show all report markers in pure picker mode

    const filtered = reports.filter(r => {
      if (filterDistrict && filterDistrict !== 'Semua' && r.district !== filterDistrict) return false;
      if (filterSeverity && filterSeverity !== 'Semua' && r.severity !== filterSeverity) return false;
      return true;
    });

    filtered.forEach(rep => {
      if (!rep.latitude || !rep.longitude) return;

      const color = getSeverityColor(rep.severity, rep.status);
      const icon = createCustomIcon(color);
      const marker = L.marker([rep.latitude, rep.longitude], { icon });

      const popupHtml = `
        <div style="font-family: inherit; width: 240px; padding: 12px; background: white;">
          ${rep.photoBefore ? `
            <img src="${rep.photoBefore}" alt="${rep.title}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 6px; margin-bottom: 8px;" />
          ` : ''}
          <div style="font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">
            ${rep.ticketCode} • ${rep.district}
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; line-height: 1.3;">
            ${rep.roadName}
          </h4>
          <p style="font-size: 12px; color: #64748b; margin: 0 0 8px 0; line-height: 1.3;">
            ${rep.title}
          </p>
          <div style="display: flex; gap: 4px; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 11px; font-weight: 600; padding: 2px 6px; border-radius: 4px; background: ${color}20; color: ${color};">
              ${rep.severity}
            </span>
            <span style="font-size: 11px; color: #475569; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">
              ${rep.status}
            </span>
          </div>
          <div style="font-size: 10px; color: #94a3b8; font-family: monospace;">
            Lat: ${rep.latitude.toFixed(4)}, Long: ${rep.longitude.toFixed(4)}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      if (onReportClick) {
        marker.on('click', () => onReportClick(rep));
      }

      markersLayerRef.current?.addLayer(marker);
    });
  }, [reports, pickerMode, filterDistrict, filterSeverity]);

  // Update picker marker
  useEffect(() => {
    if (!mapInstanceRef.current || !pickerMode) return;

    if (pickerMarkerRef.current) {
      pickerMarkerRef.current.remove();
      pickerMarkerRef.current = null;
    }

    if (selectedCoord) {
      const icon = createCustomIcon('#2563eb');
      const marker = L.marker(selectedCoord, {
        icon,
        draggable: true,
      }).addTo(mapInstanceRef.current);

      marker.on('dragend', (e) => {
        const markerPos = e.target.getLatLng();
        if (onLocationSelect) {
          onLocationSelect(
            parseFloat(markerPos.lat.toFixed(6)),
            parseFloat(markerPos.lng.toFixed(6))
          );
        }
      });

      marker.bindTooltip('Titik Koordinat Kerusakan Jalan (Geser untuk ubah)', {
        permanent: true,
        direction: 'top',
        className: 'bg-slate-900 text-white text-xs px-2 py-1 rounded shadow-sm',
      }).openTooltip();

      pickerMarkerRef.current = marker;
      mapInstanceRef.current.panTo(selectedCoord);
    }
  }, [selectedCoord, pickerMode]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-neutral-200 shadow-sm" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {pickerMode && (
        <div className="absolute top-3 left-12 z-[1000] bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-neutral-200 shadow-sm text-xs text-neutral-700 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
          <span>Klik pada peta atau geser pin untuk menentukan titik koordinat</span>
        </div>
      )}
    </div>
  );
};
