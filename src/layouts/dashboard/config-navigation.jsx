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
    protected: [RoleEnum.ADMIN_PARTENAIRE],
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
    title: 'Jeux',
    path: routesName.games,
    childrenPath: [routesName.games],
    icon: icon('manette'),
    protected: [RoleEnum.SUPER_ADMIN],
  },
  
  {
    title: 'Formations',
    path: routesName.formations,
    childrenPath: [routesName.formations, routesName.createFormation],
    icon: icon('actuality'),
  },
  {
    title: 'Campagnes',
    path: routesName.campagnes,
    childrenPath: [routesName.campagnes],
    icon: icon('actuality'),
    protected: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN_PARTENAIRE],
  },
  {
    title: 'Utilisateurs',
    path: routesName.users,
    childrenPath: [routesName.users],
    icon: icon('sondage'),
  },
  // {
  //   title: 'Admins',
  //   path: routesName.user,
  //   childrenPath: [routesName.user, routesName.createAdmin],
  //   icon: icon('ic_user'),
  // },
];

export default navConfig;
