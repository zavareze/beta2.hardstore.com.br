import type { ILink } from './link'
import type { ISubmenu } from './submenu'

export interface INavLink extends ILink {
    submenu?: ISubmenu;
}

export type INav = INavLink[];
