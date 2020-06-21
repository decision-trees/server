import { Ability, AbilityBuilder } from '@casl/ability';
import { Document } from 'mongoose';

import { User } from '../model/User';

export type Actions = 'create' | 'read' | 'update' | 'delete' | 'write';
export type Subjects = Document | 'Entity' | 'User';

export type AppAbility = Ability<[Actions, Subjects]>;

export function defineAbilitiesFor(user?: User): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>();

  if (user != null) {
    can('read', 'Entity');
  } else {
    can('read', 'Entity', { active: true });
  }
  return build();
}

export const ANONYMOUS_ABILITY = defineAbilitiesFor();
