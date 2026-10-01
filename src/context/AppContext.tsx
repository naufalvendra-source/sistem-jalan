import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppUser, 
  RoadReport, 
  RoadMasterData, 
  ReportStatus, 
  UserRole 
} from '../types';
import { 
  INITIAL_REPORTS, 
  INITIAL_ROADS, 
  INITIAL_USERS 
} from '../data/initialData';

interface AppContextType {
  currentUser: AppUser | null;
  activePage: string;
  setActivePage: (page: string) => void;
  reports: RoadReport[];
  roads: RoadMasterData[];
  users: AppUser[];
  selectedTicket: string | null;
  setSelectedTicket: (ticket: string | null) => void;
  showPhpModal: boolean;
  setShowPhpModal: (show: boolean) => void;
  showExcelDbModal: boolean;
  setShowExcelDbModal: (show: boolean) => void;
  // Actions
  loginAs: (role: UserRole, specificUserId?: string) => void;
  logout: () => void;
  createReport: (data: {
    title: string;
    roadName: string;
    district: string;
    subDistrict?: string;
    locationLandmark: string;
    latitude: number;
    longitude: number;
    category: any;
    severity: any;
    description: string;
    photoBefore: string;
    reporterName: string;
    reporterPhone: string;
    reporterNik?: string;
  }) => RoadReport;
  updateReportStatus: (
    reportId: string, 
    newStatus: ReportStatus, 
    notes: string, 
    photoAfter?: string, 
    material?: string
  ) => void;
  assignReport: (
    reportId: string, 
    officerId: string, 
    teamName: string, 
    estimatedDate?: string
  ) => void;
  rejectReport: (reportId: string, reason: string) => void;
  addRoad: (road: Omit<RoadMasterData, 'id'>) => void;
  updateRoad: (road: RoadMasterData) => void;
  deleteRoad: (roadId: string) => void;
  importReports: (newReports: RoadReport[]) => void;
  importRoads: (newRoads: RoadMasterData[]) => void;
  addUser: (user: Omit<AppUser, 'id' | 'createdAt'>) => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  REPORTS: 'sipelajar_reports_v1',
  ROADS: 'sipelajar_roads_v1',
  USERS: 'sipelajar_users_v1',
  CURRENT_USER: 'sipelajar_current_user_v1',
  ACTIVE_PAGE: 'sipelajar_active_page_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Default to Masyarakat user for seamless initial exploration
    return INITIAL_USERS[0];
  });

  const [activePage, setActivePage] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_PAGE);
    return saved || 'dashboard_masyarakat';
  });

  const [reports, setReports] = useState<RoadReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_REPORTS;
  });

  const [roads, setRoads] = useState<RoadMasterData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROADS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_ROADS;
  });

  const [selectedTicket, setSelectedTicket] = useState<string | null>('PLB-2026-8912');
  const [showPhpModal, setShowPhpModal] = useState<boolean>(false);
  const [showExcelDbModal, setShowExcelDbModal] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROADS, JSON.stringify(roads));
  }, [roads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PAGE, activePage);
  }, [activePage]);

  const loginAs = (role: UserRole, specificUserId?: string) => {
    let target = users.find(u => specificUserId ? u.id === specificUserId : u.role === role);
    if (!target) {
      target = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    }
    setCurrentUser(target);
    if (role === 'masyarakat') {
      setActivePage('dashboard_masyarakat');
    } else if (role === 'petugas') {
      setActivePage('dashboard_petugas');
    } else if (role === 'admin') {
      setActivePage('dashboard_admin');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActivePage('login');
  };

  const createReport = (data: {
    title: string;
    roadName: string;
    district: string;
    subDistrict?: string;
    locationLandmark: string;
    latitude: number;
    longitude: number;
    category: any;
    severity: any;
    description: string;
    photoBefore: string;
    reporterName: string;
    reporterPhone: string;
    reporterNik?: string;
  }): RoadReport => {
    const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
    const ticketCode = `PLB-2026-${randomTicketNum}`;
    const newId = `rep-${Date.now()}`;
    const nowIso = new Date().toISOString();
    const nowFormatted = new Date().toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB';

    const newReport: RoadReport = {
      id: newId,
      ticketCode,
      title: data.title,
      roadName: data.roadName,
      district: data.district,
      subDistrict: data.subDistrict || '',
      locationLandmark: data.locationLandmark,
      latitude: data.latitude,
      longitude: data.longitude,
      category: data.category,
      severity: data.severity,
      description: data.description,
      photoBefore: data.photoBefore,
      status: 'Menunggu Verifikasi',
      reporterName: data.reporterName,
      reporterPhone: data.reporterPhone,
      reporterNik: data.reporterNik,
      createdAt: nowIso,
      updatedAt: nowIso,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          status: 'Menunggu Verifikasi',
          timestamp: nowFormatted,
          actor: data.reporterName + ' (Pelapor)',
          notes: 'Laporan kerusakan jalan berhasil dikirim dan terdaftar di server SIPELAJAR Palembang.',
        },
      ],
    };

    setReports(prev => [newReport, ...prev]);
    setSelectedTicket(ticketCode);
    return newReport;
  };

  const updateReportStatus = (
    reportId: string, 
    newStatus: ReportStatus, 
    notes: string, 
    photoAfter?: string, 
    material?: string
  ) => {
    const nowIso = new Date().toISOString();
    const nowFormatted = new Date().toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB';

    setReports(prev => prev.map(rep => {
      if (rep.id !== reportId) return rep;
      const newTimeline = [
        ...rep.timeline,
        {
          id: `tl-${Date.now()}`,
          status: newStatus,
          timestamp: nowFormatted,
          actor: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Petugas Teknis',
          notes: notes || `Pembaruan status laporan menjadi: ${newStatus}`,
          photoUrl: photoAfter,
        },
      ];
      return {
        ...rep,
        status: newStatus,
        updatedAt: nowIso,
        photoAfter: photoAfter || rep.photoAfter,
        repairMaterialVolume: material || rep.repairMaterialVolume,
        timeline: newTimeline,
      };
    }));
  };

  const assignReport = (
    reportId: string, 
    officerId: string, 
    teamName: string, 
    estimatedDate?: string
  ) => {
    const officer = users.find(u => u.id === officerId);
    const nowIso = new Date().toISOString();
    const nowFormatted = new Date().toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB';

    setReports(prev => prev.map(rep => {
      if (rep.id !== reportId) return rep;
      return {
        ...rep,
        status: 'Ditugaskan',
        assignedOfficerId: officerId,
        assignedOfficerName: officer ? officer.name : 'Tim UPTD Jalan',
        workTeam: teamName,
        estimatedCompletionDate: estimatedDate || rep.estimatedCompletionDate,
        updatedAt: nowIso,
        timeline: [
          ...rep.timeline,
          {
            id: `tl-${Date.now()}`,
            status: 'Ditugaskan',
            timestamp: nowFormatted,
            actor: currentUser ? `${currentUser.name} (Admin PUPR)` : 'Admin Sistem',
            notes: `Surat tugas diterbitkan untuk ${officer?.name || 'Petugas'} (${teamName}). Target pengerjaan: ${estimatedDate || 'Segera'}.`,
          },
        ],
      };
    }));
  };

  const rejectReport = (reportId: string, reason: string) => {
    const nowIso = new Date().toISOString();
    const nowFormatted = new Date().toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB';

    setReports(prev => prev.map(rep => {
      if (rep.id !== reportId) return rep;
      return {
        ...rep,
        status: 'Ditolak',
        rejectionReason: reason,
        updatedAt: nowIso,
        timeline: [
          ...rep.timeline,
          {
            id: `tl-${Date.now()}`,
            status: 'Ditolak',
            timestamp: nowFormatted,
            actor: currentUser ? `${currentUser.name} (Admin PUPR)` : 'Admin Sistem',
            notes: `Laporan ditolak: ${reason}`,
          },
        ],
      };
    }));
  };

  const addRoad = (road: Omit<RoadMasterData, 'id'>) => {
    const newRoad: RoadMasterData = {
      ...road,
      id: `rd-${Date.now()}`,
    };
    setRoads(prev => [newRoad, ...prev]);
  };

  const updateRoad = (updated: RoadMasterData) => {
    setRoads(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const deleteRoad = (roadId: string) => {
    setRoads(prev => prev.filter(r => r.id !== roadId));
  };

  const importReports = (newReports: RoadReport[]) => {
    setReports(prev => [...newReports, ...prev]);
  };

  const importRoads = (newRoads: RoadMasterData[]) => {
    setRoads(prev => [...newRoads, ...prev]);
  };

  const addUser = (userData: Omit<AppUser, 'id' | 'createdAt'>) => {
    const newUser: AppUser = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      return { ...u, status: u.status === 'Aktif' ? 'Nonaktif' : 'Aktif' };
    }));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const resetAllData = () => {
    setReports(INITIAL_REPORTS);
    setRoads(INITIAL_ROADS);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setActivePage('dashboard_masyarakat');
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activePage,
        setActivePage,
        reports,
        roads,
        users,
        selectedTicket,
        setSelectedTicket,
        showPhpModal,
        setShowPhpModal,
        showExcelDbModal,
        setShowExcelDbModal,
        loginAs,
        logout,
        createReport,
        updateReportStatus,
        assignReport,
        rejectReport,
        addRoad,
        updateRoad,
        deleteRoad,
        importReports,
        importRoads,
        addUser,
        toggleUserStatus,
        deleteUser,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
