import {User} from "../../../core/types/user";
import {Workspace} from "../../../core/types/workspace";
import {EventEmitter} from "@angular/core";

export interface Menu {
  user: User | null;
  workspaces: Workspace[];
  isMenuOpen: boolean;
  onCreateWorkspace: EventEmitter<void>;
  onToggleMenu: EventEmitter<void>;

  createWorkspace(): void;

  toggleMenu(): void;
}
