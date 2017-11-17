import { Criteria } from './criteria';
import { CriteriaJoinType } from './criteria-join-type';

export class CriteriaJoin{

  criteria: Criteria;
  type: string;

  constructor(criteria: Criteria, type: CriteriaJoinType){
    this.criteria = criteria;
    this.type = CriteriaJoinType[type];
  }

}
