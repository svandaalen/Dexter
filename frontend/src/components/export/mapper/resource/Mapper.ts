import { RowWithChildTables } from '../RowWithChildTables';
import { Cell, Table } from '../Table';
import { RowWithHeader } from '../RowWithHeader';

/**
 * Map from a resource to a csv intermediary
 */
export interface Mapper<RESOURCE, RESULT> {
  canMap(toMap: RESOURCE): toMap is RESOURCE;
  map(toMap: RESOURCE, name: string): RESULT;
}
/**
 * Map to cell
 */
export interface CellMapper<RESOURCE> extends Mapper<RESOURCE, Cell> {
  canMap(toMap: RESOURCE): toMap is RESOURCE;
  map(toMap: RESOURCE): Cell;
}

/**
 * Map to row
 */
export interface RowMapper<RESOURCE> extends Mapper<RESOURCE, RowWithHeader> {
  canMap(toMap: RESOURCE): toMap is RESOURCE;
  map(toMap: RESOURCE, columnName: string): RowWithHeader;
}

/**
 * Map to a row and a list of child tables
 *
 * For example: a source can be mapped to a csv row,
 * but it also contains media and references that result in their own tables.
 */
export interface RowWithChildTablesMapper<RESOURCE>
  extends Mapper<RESOURCE, RowWithChildTables> {
  canMap(toMap: RESOURCE): toMap is RESOURCE;
  map(toMap: RESOURCE, columnName: string): RowWithChildTables;
}

/**
 * Map resource(s) to a table, including any additional child tables
 */
export interface TablesMapper<RESOURCE> extends Mapper<RESOURCE, Table[]> {
  canMap(toMap: RESOURCE): toMap is RESOURCE;
  map(toMap: RESOURCE, tableName: string): Table[];
}
