import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserRole,
  StaffUser,
  MenuItem,
  RawMaterial,
  CartItem,
  OrderTransaction,
  CalendarEvent,
  ThemeColor,
  AppLanguage,
  NotificationItem,
  FoodCategory,
} from '../types/index.ts';
import {
  INITIAL_STAFF,
  INITIAL_MENU_ITEMS,
  INITIAL_RAW_MATERIALS,
  INITIAL_ORDERS,
  INITIAL_CALENDAR_EVENTS,
} from '../utils/mockData.ts';
import { soundEffects } from '../utils/soundEffects.ts';
import { calculateOrderTotals, checkLowStock } from '../utils/posCalculations.ts';

interface AppContextType {
  // Auth & Roles
  staffList: StaffUser[];
  currentStaff: StaffUser;
  switchStaffRoleWithPin: (pin: string) => boolean;
  directSwitchStaffRole: (role: UserRole) => void;
  isPinModalOpen: boolean;
  setIsPinModalOpen: (open: boolean) => void;
  pendingRoleSwitch: UserRole | null;
  setPendingRoleSwitch: (role: UserRole | null) => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: FoodCategory;
  setSelectedCategory: (category: FoodCategory) => void;

  // Cart & POS
  cart: CartItem[];
  addToCart: (item: MenuItem, spiceLevel?: CartItem['spiceLevel'], notes?: string) => void;
  updateCartQty: (menuItemId: string, delta: number) => void;
  removeFromCart: (menuItemId: string) => void;
  clearCart: () => void;
  activeTableOrTakeaway: string;
  setActiveTableOrTakeaway: (table: string) => void;
  appliedCoupon: string;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountPercentage: number;
  couponDiscountAmount: number;

  // Calculation helpers
  subtotal: number;
  serviceFee: number;
  tax: number;
  total: number;

  // Checkout & Transactions
  orders: OrderTransaction[];
  completeCheckout: (
    paymentMethod: OrderTransaction['paymentMethod'],
    customerName: string,
    customerPhone: string,
    customerEmail: string,
    notes?: string
  ) => OrderTransaction;

  // Products CRUD
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;

  // Raw Materials / Stock CRUD
  rawMaterials: RawMaterial[];
  addRawMaterial: (material: Omit<RawMaterial, 'id'>) => void;
  updateRawMaterial: (material: RawMaterial) => void;
  restockRawMaterial: (id: string, additionalAmount: number) => void;
  deleteRawMaterial: (id: string) => void;
  criticalStockCount: number;

  // Calendar
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  deleteCalendarEvent: (id: string) => void;

  // Settings & Theme
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  offlineMode: boolean;
  setOfflineMode: (offline: boolean) => void;
  lastCloudBackup: string;
  performCloudBackup: () => void;

  // Notifications
  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;
  activeToast: string | null;
  dismissToast: () => void;

  // Modals
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  whatsappModalOrder: OrderTransaction | null;
  setWhatsappModalOrder: (order: OrderTransaction | null) => void;
  receiptModalOrder: OrderTransaction | null;
  setReceiptModalOrder: (order: OrderTransaction | null) => void;
  selectedRecipeItem: MenuItem | null;
  setSelectedRecipeItem: (item: MenuItem | null) => void;

  // Sound triggering helper
  playSound: (type: 'click' | 'cart' | 'pay' | 'alert' | 'remove') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Staff & Role
  const [staffList] = useState<StaffUser[]>(INITIAL_STAFF);
  const [currentStaff, setCurrentStaff] = useState<StaffUser>(INITIAL_STAFF[0]); // Rian Pratama (Kasir)
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pendingRoleSwitch, setPendingRoleSwitch] = useState<UserRole | null>(null);

  // Navigation
  const [activeTab, setActiveTab] = useState('pos'); // pos, dashboard, products, stock, reports, calendar, settings

  // Search & Category
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('Semua');

  // Menu items state
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('refood_menu_items');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  // Raw materials state
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(() => {
    const saved = localStorage.getItem('refood_raw_materials');
    return saved ? JSON.parse(saved) : INITIAL_RAW_MATERIALS;
  });

  // Orders state
  const [orders, setOrders] = useState<OrderTransaction[]>(() => {
    const saved = localStorage.getItem('refood_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Calendar
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('refood_calendar');
    return saved ? JSON.parse(saved) : INITIAL_CALENDAR_EVENTS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTableOrTakeaway, setActiveTableOrTakeaway] = useState('Meja 04');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);

  // Settings
  const [themeColor, setThemeColor] = useState<ThemeColor>('orange');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<AppLanguage>('id');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [lastCloudBackup, setLastCloudBackup] = useState<string>('2026-10-29 04:00 WIB');

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Peringatan Stok Menipis!',
      message: 'Daging Ayam Fillet tersisa 4.0 kg (di bawah batas kritis 6.0 kg). Segera pesan ke supplier.',
      type: 'stock',
      timestamp: 'Baru saja',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Transaksi Berhasil #1092',
      message: 'Pesanan Meja 04 senilai Rp 125.664 telah berhasil dibayar via QRIS.',
      type: 'order',
      timestamp: '25 mnt lalu',
      read: false,
    },
  ]);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [whatsappModalOrder, setWhatsappModalOrder] = useState<OrderTransaction | null>(null);
  const [receiptModalOrder, setReceiptModalOrder] = useState<OrderTransaction | null>(null);
  const [selectedRecipeItem, setSelectedRecipeItem] = useState<MenuItem | null>(null);

  // Auto detect dark mode from system preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Update HTML class for dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist items, materials, orders
  useEffect(() => {
    localStorage.setItem('refood_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('refood_raw_materials', JSON.stringify(rawMaterials));
  }, [rawMaterials]);

  useEffect(() => {
    localStorage.setItem('refood_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('refood_calendar', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  // Sound trigger helper
  const playSound = (type: 'click' | 'cart' | 'pay' | 'alert' | 'remove') => {
    if (!soundEnabled) return;
    switch (type) {
      case 'click':
        soundEffects.playClick();
        break;
      case 'cart':
        soundEffects.playAddToCart();
        break;
      case 'pay':
        soundEffects.playPaymentSuccess();
        break;
      case 'alert':
        soundEffects.playAlert();
        break;
      case 'remove':
        soundEffects.playRemove();
        break;
    }
  };

  const showToast = (message: string) => {
    setActiveToast(message);
    setTimeout(() => {
      setActiveToast(prev => (prev === message ? null : prev));
    }, 4500);
  };

  const dismissToast = () => setActiveToast(null);

  // Switch role with PIN verification
  const switchStaffRoleWithPin = (pin: string): boolean => {
    const targetUser = staffList.find(s => s.role === pendingRoleSwitch);
    if (!targetUser) return false;

    if (targetUser.pin === pin) {
      setCurrentStaff(targetUser);
      setIsPinModalOpen(false);
      setPendingRoleSwitch(null);
      playSound('click');
      showToast(`Berhasil masuk sebagai ${targetUser.name} (${targetUser.role.toUpperCase()})`);
      return true;
    }
    return false;
  };

  const directSwitchStaffRole = (role: UserRole) => {
    const user = staffList.find(s => s.role === role);
    if (user) {
      setCurrentStaff(user);
      playSound('click');
      showToast(`Hak akses berganti ke ${user.name} (${user.role.toUpperCase()})`);
    }
  };

  // Cart calculations
  const rawSubtotal = cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  const totals = calculateOrderTotals({
    subtotal: rawSubtotal,
    discountPercentage,
    couponDiscountAmount,
    serviceFeeRate: 0.02,
    taxRate: 0.10,
  });

  const subtotal = totals.subtotal;
  const serviceFee = totals.serviceFeeAmount;
  const tax = totals.taxAmount;
  const total = totals.total;

  const addToCart = (item: MenuItem, spiceLevel: CartItem['spiceLevel'] = 'Sedang', notes = '') => {
    playSound('cart');
    setCart(prev => {
      const existingIdx = prev.findIndex(i => i.menuItem.id === item.id && i.spiceLevel === spiceLevel);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx].quantity += 1;
        return copy;
      } else {
        return [...prev, { menuItem: item, quantity: 1, spiceLevel, notes }];
      }
    });
    showToast(`Ditambahkan ke keranjang: ${item.name}`);
  };

  const updateCartQty = (menuItemId: string, delta: number) => {
    playSound('click');
    setCart(prev => {
      return prev
        .map(item => {
          if (item.menuItem.id === menuItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (menuItemId: string) => {
    playSound('remove');
    setCart(prev => prev.filter(i => i.menuItem.id !== menuItemId));
  };

  const clearCart = () => {
    playSound('remove');
    setCart([]);
    setAppliedCoupon('');
    setDiscountPercentage(0);
    setCouponDiscountAmount(0);
  };

  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'HEMAT10') {
      setAppliedCoupon('HEMAT10 (Diskon 10%)');
      setDiscountPercentage(10);
      setCouponDiscountAmount(0);
      playSound('pay');
      return { success: true, message: 'Kupon HEMAT10 berhasil! Potongan 10% diterapkan.' };
    } else if (normalized === 'REFOODFREE') {
      setAppliedCoupon('REFOODFREE (Potongan Rp 15.000)');
      setDiscountPercentage(0);
      setCouponDiscountAmount(15000);
      playSound('pay');
      return { success: true, message: 'Kupon REFOODFREE berhasil! Potongan Rp 15.000 diterapkan.' };
    }
    return { success: false, message: 'Kode kupon tidak valid. Coba kode: HEMAT10 atau REFOODFREE' };
  };

  const removeCoupon = () => {
    setAppliedCoupon('');
    setDiscountPercentage(0);
    setCouponDiscountAmount(0);
  };

  // Complete checkout & automatically deduct inventory based on recipes
  const completeCheckout = (
    paymentMethod: OrderTransaction['paymentMethod'],
    customerName: string,
    customerPhone = '+62 812-3456-7890',
    customerEmail = 'pelanggan@gmail.com',
    notes = ''
  ): OrderTransaction => {
    const orderNumber = `#${1093 + orders.length}`;
    const newOrder: OrderTransaction = {
      id: `ORD-${Date.now()}`,
      orderNumber,
      timestamp: new Date().toISOString(),
      customerName: customerName || 'Pelanggan Walk-in',
      customerPhone,
      customerEmail,
      tableOrTakeaway: activeTableOrTakeaway,
      items: [...cart],
      subtotal,
      discount: totals.discountAmount,
      serviceFee,
      tax,
      total,
      paymentMethod,
      paymentStatus: 'paid',
      cashierName: currentStaff.name,
      notes,
    };

    // Deduct stock for ingredients in order's menu items
    setRawMaterials(prevMaterials => {
      const updatedMaterials = [...prevMaterials];
      const newlyCriticalItems: string[] = [];

      for (const cartItem of cart) {
        if (cartItem.menuItem.recipe && cartItem.menuItem.recipe.length > 0) {
          for (const ingredient of cartItem.menuItem.recipe) {
            const matIdx = updatedMaterials.findIndex(m => m.id === ingredient.rawMaterialId);
            if (matIdx >= 0) {
              const current = updatedMaterials[matIdx];
              const neededTotal = ingredient.amountNeeded * cartItem.quantity;
              const newStock = Math.max(0, Number((current.currentStock - neededTotal).toFixed(2)));
              updatedMaterials[matIdx] = {
                ...current,
                currentStock: newStock,
              };

              const stockStatus = checkLowStock(newStock, current.minThreshold);
              if (stockStatus.isCritical) {
                newlyCriticalItems.push(`${current.name} (${newStock} ${current.unit})`);
              }
            }
          }
        }
      }

      if (newlyCriticalItems.length > 0) {
        playSound('alert');
        setNotifications(prev => [
          {
            id: `alert-${Date.now()}`,
            title: '⚠️ Peringatan Bahan Kritis!',
            message: `Bahan baku mendekati habis: ${newlyCriticalItems.join(', ')}. Segera lakukan restock!`,
            type: 'stock',
            timestamp: 'Baru saja',
            read: false,
          },
          ...prev,
        ]);
      }

      return updatedMaterials;
    });

    // Add order to orders list
    setOrders(prev => [newOrder, ...prev]);

    // Push notification for transaction success
    setNotifications(prev => [
      {
        id: `ord-notif-${Date.now()}`,
        title: `✅ Transaksi Sukses ${newOrder.orderNumber}`,
        message: `${newOrder.customerName} (${newOrder.tableOrTakeaway}) - Total: Rp ${newOrder.total.toLocaleString('id-ID')} via ${newOrder.paymentMethod.toUpperCase()}`,
        type: 'order',
        timestamp: 'Baru saja',
        read: false,
      },
      ...prev,
    ]);

    playSound('pay');
    showToast(`Pesanan ${newOrder.orderNumber} berhasil dicatat & dibayar!`);
    clearCart();
    setIsPaymentModalOpen(false);
    return newOrder;
  };

  // Menu items CRUD
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `menu-${Date.now()}`,
    };
    setMenuItems(prev => [newItem, ...prev]);
    showToast(`Menu baru "${newItem.name}" berhasil ditambahkan.`);
  };

  const updateMenuItem = (item: MenuItem) => {
    setMenuItems(prev => prev.map(m => (m.id === item.id ? item : m)));
    showToast(`Menu "${item.name}" berhasil diperbarui.`);
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(m => m.id !== id));
    showToast('Menu berhasil dihapus.');
  };

  // Raw materials CRUD
  const addRawMaterial = (material: Omit<RawMaterial, 'id'>) => {
    const newMaterial: RawMaterial = {
      ...material,
      id: `raw-${Date.now()}`,
      lastRestocked: new Date().toISOString().slice(0, 10),
    };
    setRawMaterials(prev => [...prev, newMaterial]);
    showToast(`Bahan baku "${newMaterial.name}" berhasil ditambahkan.`);
  };

  const updateRawMaterial = (material: RawMaterial) => {
    setRawMaterials(prev => prev.map(m => (m.id === material.id ? material : m)));
    showToast(`Bahan "${material.name}" berhasil diupdate.`);
  };

  const restockRawMaterial = (id: string, additionalAmount: number) => {
    setRawMaterials(prev =>
      prev.map(m => {
        if (m.id === id) {
          const newQty = Number((m.currentStock + additionalAmount).toFixed(2));
          return {
            ...m,
            currentStock: newQty,
            lastRestocked: new Date().toISOString().slice(0, 10),
          };
        }
        return m;
      })
    );
    playSound('pay');
    showToast(`Restock berhasil ditambahkan! Stok terupdate.`);
  };

  const deleteRawMaterial = (id: string) => {
    setRawMaterials(prev => prev.filter(m => m.id !== id));
    showToast('Bahan baku dihapus.');
  };

  const criticalStockCount = rawMaterials.filter(m => m.currentStock <= m.minThreshold).length;

  // Calendar CRUD
  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `ev-${Date.now()}`,
    };
    setCalendarEvents(prev => [...prev, newEvent]);
    showToast(`Jadwal "${newEvent.title}" berhasil dibuat.`);
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
    showToast('Jadwal berhasil dihapus.');
  };

  // Cloud backup simulation
  const performCloudBackup = () => {
    const now = new Date();
    const formatted = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB';
    setLastCloudBackup(formatted);
    playSound('pay');
    showToast('☁️ Backup data ke cloud berhasil disinkronkan secara aman!');
  };

  // Notifications
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <AppContext.Provider
      value={{
        staffList,
        currentStaff,
        switchStaffRoleWithPin,
        directSwitchStaffRole,
        isPinModalOpen,
        setIsPinModalOpen,
        pendingRoleSwitch,
        setPendingRoleSwitch,

        activeTab,
        setActiveTab,

        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,

        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        activeTableOrTakeaway,
        setActiveTableOrTakeaway,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountPercentage,
        couponDiscountAmount,

        subtotal,
        serviceFee,
        tax,
        total,

        orders,
        completeCheckout,

        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,

        rawMaterials,
        addRawMaterial,
        updateRawMaterial,
        restockRawMaterial,
        deleteRawMaterial,
        criticalStockCount,

        calendarEvents,
        addCalendarEvent,
        deleteCalendarEvent,

        themeColor,
        setThemeColor,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        language,
        setLanguage,
        soundEnabled,
        setSoundEnabled,
        offlineMode,
        setOfflineMode,
        lastCloudBackup,
        performCloudBackup,

        notifications,
        markAllNotificationsRead,
        unreadNotificationsCount,
        activeToast,
        dismissToast,

        isPaymentModalOpen,
        setIsPaymentModalOpen,
        whatsappModalOrder,
        setWhatsappModalOrder,
        receiptModalOrder,
        setReceiptModalOrder,
        selectedRecipeItem,
        setSelectedRecipeItem,

        playSound,
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
