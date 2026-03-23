import { RoleEnum } from 'src/constants/role';
import {routesName} from 'src/constants/routes';

import SvgColor from 'src/components/svg-color';
// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'statistiques',
    path: routesName.dashboardGlobal,
    childrenPath: [routesName.dashboardGlobal],
    icon: icon('ic_analytics'),
    protected: [RoleEnum.ADMIN_PARTENAIRE, RoleEnum.ADMIN_PRODUCTION],
  },
  {
    title: 'statistiques',
    path: routesName.dashboard,
    childrenPath: [routesName.dashboard],
    icon: icon('ic_analytics'),
    protected: [RoleEnum.SUPER_ADMIN],
  },
  
  {
    title: 'Partenaires',
    path: routesName.partners,
    childrenPath: [routesName.partners],
    icon: icon('nomine'),
    protected: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN_PARTENAIRE],
  },
  {
    title: 'Maison de Production',
    path: routesName.productionHouse,
    childrenPath: [routesName.productionHouse],
    icon: icon('nomine'),
    protected: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN_PARTENAIRE],
  },
  {
    title: 'Films',
    path: routesName.moovies,
    childrenPath: [routesName.moovies],
    icon: icon('manette'),
    protected: [RoleEnum.SUPER_ADMIN],
  },
  {
    title: 'Mes films',
    path: routesName.moovies,
    childrenPath: [routesName.moovies],
    icon: icon('manette'),
    protected: [RoleEnum.ADMIN_PRODUCTION],
  },
  
  {
    title: 'Formations',
    path: routesName.formations,
    childrenPath: [routesName.formations, routesName.createFormation],
    icon: icon('actuality'),
  },
  // {
  //   title: 'Campagnes',
  //   path: routesName.campagnes,
  //   childrenPath: [routesName.campagnes],
  //   icon: icon('actuality'),
  //   protected: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN_PARTENAIRE],
  // },
  // {
  //   title: 'Utilisateurs',
  //   path: routesName.users,
  //   childrenPath: [routesName.users],
  //   icon: icon('sondage'),
  //   protected: [RoleEnum.SUPER_ADMIN],
  // },
  // {
  //   title: 'Admins',
  //   path: routesName.user,
  //   childrenPath: [routesName.user, routesName.createAdmin],
  //   icon: icon('ic_user'),
  // },
];

export default navConfig;
