import { JoinType } from './join-type';
import { Criteria } from './criteria';
import { CriteriaJoin } from './criteria-join';
import { CriteriaJoinType } from './criteria-join-type';

export class Join {

  type: string;
  table: string;
  subQuerys: Array<CriteriaJoin> = [];

  constructor(table: string, type: JoinType){
    this.table = table;
    this.type = JoinType[type];
  }

  public on(criteria: Criteria):Join{
    this.subQuerys.push(new CriteriaJoin(criteria, CriteriaJoinType.ON));
    return this;
  }

  public and(criteria: Criteria):Join{
    this.subQuerys.push(new CriteriaJoin(criteria, CriteriaJoinType.AND));
    return this;
  }

  public or(criteria: Criteria):Join{
    this.subQuerys.push(new CriteriaJoin(criteria, CriteriaJoinType.OR));
    return this;
  }

}
