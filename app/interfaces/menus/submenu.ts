import type { IMenu } from './menu'
import type { IMegamenu } from './megamenu'

export interface ISubmenuMenu {
    type: 'menu';
    menu: IMenu;
    logged?: boolean;
}

export interface ISubmenuMegamenu {
    type: 'megamenu';
    menu: IMegamenu;
}

export type ISubmenu = ISubmenuMenu | ISubmenuMegamenu;
