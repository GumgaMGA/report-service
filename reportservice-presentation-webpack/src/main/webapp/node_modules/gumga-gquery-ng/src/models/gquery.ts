import { LogicalOperator } from './logical-operator';
import { Criteria } from './criteria';
import { Join } from './join';

export class GQuery {

  private logicalOperator: string;
  private criteria: Criteria;
  private subQuerys: Array<GQuery> = [];
  private joins: Array<Join> = [];

  constructor(p1?: any, p2?: any, p3?: any){
    if(typeof p1 == "number") this.logicalOperator = LogicalOperator[p1];
    if(typeof p2 == "number") this.logicalOperator = LogicalOperator[p2];
    if(typeof p3 == "number") this.logicalOperator = LogicalOperator[p3];
    if(p1 instanceof Criteria) this.criteria = p1;
    if(p2 instanceof Criteria) this.criteria = p2;
    if(p3 instanceof Criteria) this.criteria = p3;
    if(p1 instanceof Array) this.subQuerys = p1;
    if(p2 instanceof Array) this.subQuerys = p2;
    if(p3 instanceof Array) this.subQuerys = p3;
    if(!this.logicalOperator) this.logicalOperator = 'SIMPLE';
  }

  public getLogicalOperator():string {
     return this.logicalOperator;
   }

   public setLogicalOperator(logicalOperator: LogicalOperator):GQuery {
     this.logicalOperator = LogicalOperator[logicalOperator];
     return this;
   }

   public getCriteria():Criteria {
     return this.criteria;
   }

   public setCriteria(criteria: Criteria):GQuery {
     this.criteria = criteria;
     return this;
   }

   public getSubQuerys():Array<GQuery> {
     return this.subQuerys;
   }

   public setSubQuerys(subQuerys: Array<GQuery>):GQuery {
     this.subQuerys = subQuerys;
     return this;
   }

   private andGQuery(other: GQuery){
      if (LogicalOperator[LogicalOperator.AND] === this.logicalOperator){
          this.subQuerys = this.subQuerys || new Array();
          this.subQuerys.push(other);
          return this;
      }
      return new GQuery(LogicalOperator.AND, null, new Array<GQuery>(this, other));
   }

   public and(criteriaOrGQuery: any): GQuery {
      if(criteriaOrGQuery instanceof GQuery){
        return this.andGQuery(criteriaOrGQuery);
      }else{
        let other: GQuery = new GQuery();
        other.setCriteria(criteriaOrGQuery);
        if (LogicalOperator[LogicalOperator.AND] == this.logicalOperator) {
          this.subQuerys = Object.assign(new Array(), this.subQuerys);
          this.subQuerys.push(other);
          return this;
        }
        return new GQuery(LogicalOperator.AND, null, new Array<GQuery>(this, other));
      }
   }

   private orGQuery(other: GQuery):GQuery {
    if (LogicalOperator[LogicalOperator.OR] == this.logicalOperator) {
        this.subQuerys = Object.assign(new Array(), this.subQuerys);
        this.subQuerys.push(other);
        return this;
    }
    return new GQuery(LogicalOperator.OR, null, new Array<GQuery>(this, other));
  }

  public or(criteriaOrGQuery: Criteria):GQuery {
    if(criteriaOrGQuery instanceof GQuery){
      return this.orGQuery(criteriaOrGQuery);
    }else{
      let other:GQuery = new GQuery(null, criteriaOrGQuery);
      if (LogicalOperator[LogicalOperator.OR] == this.logicalOperator) {
          this.subQuerys = Object.assign(new Array(), this.subQuerys);
          this.subQuerys.push(other);
          return this;
      }
      return new GQuery(LogicalOperator.OR, null, new Array<GQuery>(this, other));
    }
  }

  public join(join: Join):GQuery {
      this.joins.push(join);
      return this;
  }

}
