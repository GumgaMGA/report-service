import { GQuery, Criteria, ComparisonOperator, LogicalOperator, JoinType, Join, CriteriaField } from './models';

declare let window;

window.GQuery   = window.GQuery || GQuery;
window.Criteria = window.Criteria || Criteria;
window.ComparisonOperator = window.ComparisonOperator || ComparisonOperator;
window.LogicalOperator = window.LogicalOperator || LogicalOperator;
window.JoinType = window.JoinType || JoinType;
window.Join = window.Join || Join;
window.CriteriaField = window.CriteriaField || CriteriaField;

export default window.GQuery;
