'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
  School as SchoolIcon,
  Quiz as QuizIcon,
  ExpandLess,
  ExpandMore,
  PlayArrow,
  ChevronRight,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import NextLink from 'next/link';

const DRAWER_WIDTH = 280;
const DRAWER_WIDTH_COLLAPSED = 72;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'practice',
    label: 'Ôn luyện',
    icon: <SchoolIcon />,
    children: [
      { id: 'part1', label: 'Part 1', icon: <PlayArrow />, path: '/practice/part1' },
      { id: 'part2', label: 'Part 2', icon: <PlayArrow />, path: '/practice/part2' },
      { id: 'part3', label: 'Part 3', icon: <PlayArrow />, path: '/practice/part3' },
      { id: 'part4', label: 'Part 4', icon: <PlayArrow />, path: '/practice/part4' },
      { id: 'part5', label: 'Part 5', icon: <PlayArrow />, path: '/practice/part5' },
      { id: 'part6', label: 'Part 6', icon: <PlayArrow />, path: '/practice/part6' },
      { id: 'part7', label: 'Part 7', icon: <PlayArrow />, path: '/practice/part7' },
    ],
  },
  {
    id: 'exam',
    label: 'Thi Thử',
    icon: <QuizIcon />,
    path: '/exam',
  },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    practice: true, // Practice menu mở mặc định
  });
  
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Khởi tạo state cho mobile khi component mount và reset collapse state
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(false); // Reset collapse state trên mobile
      setOpenMenus(prev => ({
        ...prev,
        practice: true
      }));
    }
  }, [isMobile]);

  // Tự động đóng tất cả submenu khi sidebar collapse (chỉ cho desktop)
  useEffect(() => {
    if (!isMobile) {
      if (sidebarCollapsed) {
        setOpenMenus({});
      } else {
        // Mở lại practice menu khi expand
        setOpenMenus(prev => ({
          ...prev,
          practice: true
        }));
      }
    }
  }, [sidebarCollapsed, isMobile]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.children) {
      if (isMobile && item.id === 'practice') {
        // Mobile: Practice menu luôn mở, không cho phép đóng
        return;
      } else if (sidebarCollapsed && !isMobile) {
        // Desktop collapsed: expand sidebar để hiển thị submenu
        setSidebarCollapsed(false);
        // Set menu mở ngay lập tức (sẽ được xử lý trong useEffect)
        setTimeout(() => {
          setOpenMenus(prev => ({
            ...prev,
            [item.id]: true
          }));
        }, 100);
      } else {
        // Logic bình thường cho desktop không collapsed
        setOpenMenus(prev => ({
          ...prev,
          [item.id]: !prev[item.id]
        }));
      }
    } else if (item.path) {
      router.push(item.path);
      if (isMobile) {
        setMobileOpen(false);
      }
    }
  };

  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { label: 'Trang chủ', path: '/' }
    ];

    if (pathSegments.length > 0) {
      if (pathSegments[0] === 'practice') {
        breadcrumbs.push({ label: 'Ôn luyện', path: '/practice' });
        
        if (pathSegments[1]) {
          const partLabel = pathSegments[1].replace('part', 'Part ');
          breadcrumbs.push({ 
            label: partLabel.charAt(0).toUpperCase() + partLabel.slice(1), 
            path: `/${pathSegments[0]}/${pathSegments[1]}` 
          });
        }

        if (pathSegments[2] === 'phrases' && pathSegments[3]) {
          breadcrumbs.push({ 
            label: 'Cụm từ thường gặp', 
            path: `/${pathSegments[0]}/${pathSegments[1]}` 
          });

          const categoryLabels: { [key: string]: string } = {
            'people': 'Cụm từ tả người',
            'scene': 'Cụm từ tả cảnh', 
            'object': 'Cụm từ tả vật',
            'summary': 'Cụm từ tổng hợp'
          };
          
          breadcrumbs.push({ 
            label: categoryLabels[pathSegments[3]] || pathSegments[3], 
            path: pathname 
          });
        }

        if (pathSegments[2] === 'questions' && pathSegments[3]) {
          breadcrumbs.push({ 
            label: 'Loại câu hỏi', 
            path: `/${pathSegments[0]}/${pathSegments[1]}` 
          });

          const questionTypeLabels: { [key: string]: string } = {
            'what': 'Câu hỏi WHAT',
            'who': 'Câu hỏi WHO',
            'where': 'Câu hỏi WHERE',
            'when': 'Câu hỏi WHEN',
            'how': 'Câu hỏi HOW',
            'why': 'Câu hỏi WHY',
            'yesno': 'Câu hỏi YES/NO',
            'tag': 'Câu hỏi đuôi',
            'choice': 'Câu hỏi lựa chọn',
            'request': 'Câu yêu cầu, đề nghị',
            'statement': 'Câu trần thuật'
          };
          
          breadcrumbs.push({ 
            label: questionTypeLabels[pathSegments[3]] || pathSegments[3], 
            path: pathname 
          });
        }
      } else if (pathSegments[0] === 'exam') {
        breadcrumbs.push({ label: 'Thi Thử', path: '/exam' });
      }
    }

    return breadcrumbs;
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isSelected = pathname === item.path;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus[item.id];

    return (
      <React.Fragment key={item.id}>
        <ListItem 
          disablePadding 
          sx={{ 
            pl: level * 2,
            display: 'block',
            position: 'relative'
          }}
        >
          <ListItemButton
            onClick={() => handleMenuClick(item)}
            selected={isSelected}
            sx={{
              minHeight: 48,
              justifyContent: sidebarCollapsed ? 'center' : 'initial',
              px: 2.5,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
              '&:hover': {
                backgroundColor: level === 0 ? 'primary.light' : 'primary.50',
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: sidebarCollapsed ? 'auto' : 2,
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            
            {!sidebarCollapsed && (
              <>
                <ListItemText 
                  primary={item.label}
                  sx={{ 
                    opacity: 1,
                    transition: theme.transitions.create('opacity', {
                      easing: theme.transitions.easing.sharp,
                      duration: theme.transitions.duration.enteringScreen,
                      delay: 200, // Delay lâu hơn để width animation chạy xong
                    }),
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                  }}
                />
                {hasChildren && (
                  <Box sx={{
                    opacity: 1,
                    transition: theme.transitions.create('opacity', {
                      easing: theme.transitions.easing.sharp,
                      duration: theme.transitions.duration.enteringScreen,
                      delay: 200,
                    })
                  }}>
                    {/* Mobile: Practice menu luôn hiển thị ExpandLess */}
                    {isMobile && item.id === 'practice' ? (
                      <ExpandLess />
                    ) : (
                      isOpen ? <ExpandLess /> : <ExpandMore />
                    )}
                  </Box>
                )}
              </>
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse 
            in={isOpen && (isMobile || !sidebarCollapsed)} 
            timeout={!isMobile && sidebarCollapsed ? 0 : 200} 
            unmountOnExit
          >
            <List component="div" disablePadding>
              {item.children!.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
        
        {/* Hiển thị submenu dạng tooltip khi collapsed (chỉ desktop) */}
        {hasChildren && sidebarCollapsed && isOpen && !isMobile && (
          <Box
            sx={{
              position: 'absolute',
              left: DRAWER_WIDTH_COLLAPSED,
              top: 0,
              minWidth: 200,
              backgroundColor: 'white',
              boxShadow: theme.shadows[8],
              borderRadius: 1,
              zIndex: 1300,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <List component="div" disablePadding>
              {item.children!.map(child => (
                <ListItem key={child.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleMenuClick(child)}
                    sx={{
                      px: 2,
                      py: 1,
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {child.icon}
                    </ListItemIcon>
                    <ListItemText primary={child.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </React.Fragment>
    );
  };

  const drawerWidth = sidebarCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Header */}
      <Toolbar 
        sx={{ 
          backgroundColor: 'primary.main', 
          color: 'white',
          minHeight: 64,
          justifyContent: 'center'
        }}
      >
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            fontWeight: 'bold', 
            color: 'white',
            textAlign: 'center',
            fontSize: { xs: '16px', md: '20px' },
            overflow: 'hidden',
            whiteSpace: 'nowrap'
          }}
        >
          Ken TOEIC
        </Typography>
      </Toolbar>
      
      <Divider />
      
      {/* Navigation Menu */}
      <List sx={{ pt: 1, flex: 1 }}>
        {menuItems.map(item => renderMenuItem(item))}
      </List>

      {/* Toggle Button - Fixed at Bottom */}
      {!isMobile && (
        <>
          <Divider />
          <Box sx={{ p: 1, backgroundColor: 'primary.dark' }}>
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              sx={{ 
                color: 'white',
                width: '100%',
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'primary.main'
                }
              }}
            >
              {sidebarCollapsed ? <MenuIcon /> : <MenuOpenIcon />}
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  );

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar 
          disableGutters 
          sx={{ 
            minHeight: { xs: 56, md: 64 }
          }}
        >
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className="mobile-menu-btn"
            >
              <MenuIcon />
            </IconButton>
          )}
          
          {/* Breadcrumbs */}
          <Box sx={{ 
            flexGrow: 1,
          }}>
            <Breadcrumbs 
              aria-label="breadcrumb" 
              sx={{
                color: 'white',
                '& .MuiBreadcrumbs-separator': {
                  margin: '0 8px'
                }
              }}
              separator={<ChevronRight fontSize="small" sx={{ color: 'white' }} />}
            >
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return isLast ? (
                  <Typography 
                    key={crumb.path} 
                    color="inherit" 
                    sx={{ 
                      fontWeight: 500,
                      fontSize: { xs: '14px', md: '16px' }
                    }}
                  >
                    {crumb.label}
                  </Typography>
                ) : (
                  <Link
                    key={crumb.path}
                    color="inherit"
                    component={NextLink}
                    href={crumb.path}
                    sx={{ 
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                      opacity: 0.9,
                      fontSize: { xs: '13px', md: '15px' }
                    }}
                  >
                    {crumb.label}
                  </Link>
                );
              })}
            </Breadcrumbs>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="navigation folders"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            zIndex: 9999,
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
              overflowX: 'hidden',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        className="dashboard-main"
        sx={{ 
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#f5f5f5',
          minHeight: { xs: 'calc(100vh - 80px)', md: 'calc(100vh - 112px)' },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
