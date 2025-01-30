import {
  type IAnyStateTreeNode,
  type Instance,
  types,
  flow,
} from 'mobx-state-tree';

import type { CompanyType, PeopleType } from 'common/types';

import { tegonDatabase } from 'store/database';

import { Company } from './models';

export const CompanyStore: IAnyStateTreeNode = types
  .model({
    companies: types.map(Company),
  })
  .actions((self) => {
    const update = (company: CompanyType, id: string) => {
      if (!self.companies.has(id)) {
        self.companies.set(id, Company.create(company));
      } else {
        // Simply update the existing support metadata
        const existingPeople = self.companies.get(id);
        Object.assign(existingPeople, company);
      }
    };
    const deleteById = (id: string) => {
      // Find the support metadata with matching id and remove it
      for (const [companyId, company] of self.companies.entries()) {
        if (company.id === id) {
          self.companies.delete(companyId);
          break;
        }
      }
    };

    const load = flow(function* () {
      const people = yield tegonDatabase.company.toArray();

      people.forEach((metadata: PeopleType) => {
        self.companies.set(metadata.id, Company.create(metadata));
      });
    });

    return { update, deleteById, load };
  })
  .views((self) => ({
    getCompanyForId(id: string) {
      return self.companies.get(id);
    },
  }));

export type CompanyStoreType = Instance<typeof CompanyStore>;
