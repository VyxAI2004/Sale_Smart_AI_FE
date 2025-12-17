import {
  LayoutDashboard,
  Monitor,
  ListTodo,
  Bell,
  Palette,
  Cpu,
  Settings,
  UserCog,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  ShoppingCart,
  Search,
  BarChart3,
} from 'lucide-react'
import i18n from '@/lib/i18n'
import { type SidebarData } from '../types'

export const getSidebarData = (): SidebarData => {
  const t = (key: string) => i18n.t(key) || key

  return {
    user: {
      name: 'satnaing',
      email: 'satnaingdev@gmail.com',
      avatar: '/avatars/shadcn.jpg',
    },
    projects: [],
    teams: [
      {
        name: 'Shadcn Admin',
        logo: Command,
        plan: 'Vite + ShadcnUI',
      },
      {
        name: 'Acme Inc',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise',
      },
      {
        name: 'Acme Corp.',
        logo: AudioWaveform,
        plan: 'Startup',
      },
    ],
    navGroups: [
      {
        title: t('sidebar.general'),
        items: [
          {
            title: t('sidebar.dashboard'),
            url: '/',
            icon: LayoutDashboard,
          },
          {
            title: t('sidebar.tasks'),
            url: '/tasks',
            icon: ListTodo,
          },
          {
            title: t('sidebar.products'),
            url: '/products',
            icon: ShoppingCart,
          },
          {
            title: t('sidebar.findProduct'),
            url: '/find-products',
            icon: Search,
          },
          {
            title: t('sidebar.analytics'),
            url: '/analytics',
            icon: BarChart3,
          },
          // Apps - Hidden temporarily
          // {
          //   title: t('sidebar.apps'),
          //   url: '/apps',
          //   icon: Package,
          // },
          // Chats - Hidden temporarily
          // {
          //   title: t('sidebar.chats'),
          //   url: '/chats',
          //   badge: '3',
          //   icon: MessagesSquare,
          // },
          // Users - Hidden temporarily
          // {
          //   title: t('sidebar.users'),
          //   url: '/users',
          //   icon: Users,
          // },
          // Secured by Clerk - Hidden temporarily
          // {
          //   title: t('sidebar.securedByClerk'),
          //   icon: ClerkLogo,
          //   items: [
          //     {
          //       title: t('sidebar.signIn'),
          //       url: '/clerk/sign-in',
          //     },
          //     {
          //       title: t('sidebar.signUp'),
          //       url: '/clerk/sign-up',
          //     },
          //     {
          //       title: t('sidebar.userManagement'),
          //       url: '/clerk/user-management',
          //     },
          //   ],
          // },
        ],
      },
      // Pages section - Hidden temporarily (Auth and Errors)
      // {
      //   title: t('sidebar.pages'),
      //   items: [
      //     {
      //       title: t('sidebar.auth'),
      //       icon: ShieldCheck,
      //       items: [
      //         {
      //           title: t('sidebar.signIn'),
      //           url: '/sign-in',
      //         },
      //         {
      //           title: t('sidebar.signIn2Col'),
      //           url: '/sign-in-2',
      //         },
      //         {
      //           title: t('sidebar.signUp'),
      //           url: '/sign-up',
      //         },
      //         {
      //           title: t('sidebar.forgotPassword'),
      //           url: '/forgot-password',
      //         },
      //         {
      //           title: t('sidebar.otp'),
      //           url: '/otp',
      //         },
      //       ],
      //     },
      //     {
      //       title: t('sidebar.errors'),
      //       icon: Bug,
      //       items: [
      //         {
      //           title: t('sidebar.unauthorized'),
      //           url: '/errors/unauthorized',
      //           icon: Lock,
      //         },
      //         {
      //           title: t('sidebar.forbidden'),
      //           url: '/errors/forbidden',
      //           icon: UserX,
      //         },
      //         {
      //           title: t('sidebar.notFound'),
      //           url: '/errors/not-found',
      //           icon: FileX,
      //         },
      //         {
      //           title: t('sidebar.internalServerError'),
      //           url: '/errors/internal-server-error',
      //           icon: ServerOff,
      //         },
      //         {
      //           title: t('sidebar.maintenanceError'),
      //           url: '/errors/maintenance-error',
      //           icon: Construction,
      //         },
      //       ],
      //     },
      //   ],
      // },
      {
        title: t('sidebar.other'),
        items: [
          {
            title: t('sidebar.settings'),
            icon: Settings,
            items: [
              {
                title: t('sidebar.profile'),
                url: '/settings',
                icon: UserCog,
              },
              {
                title: t('sidebar.appearance'),
                url: '/settings/appearance',
                icon: Palette,
              },
              {
                title: t('sidebar.notifications'),
                url: '/settings/notifications',
                icon: Bell,
              },
              {
                title: t('sidebar.display'),
                url: '/settings/display',
                icon: Monitor,
              },
              {
                title: t('sidebar.aiAndModels'),
                url: '/settings/ai-and-models',
                icon: Cpu,
              },
            ],
          },
          // Help Center - Hidden temporarily
          // {
          //   title: t('sidebar.helpCenter'),
          //   url: '/help-center',
          //   icon: HelpCircle,
          // },
        ],
      },
    ],
  }
}

// Export for backward compatibility
export const sidebarData = getSidebarData()
