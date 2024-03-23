import { Csvable } from './Csvable';
import { BasicTable, Cell, Header, Row, Table } from './Table';
import { ArrayTable } from './ArrayTable';

export class RowWithHeader implements Csvable, Table {
  name: string;

  /**
   * Result of resource mapped to a table containing headers and a single row:
   */
  private rowTable: Table;

  constructor(name: string, from?: ArrayTable) {
    this.name = name;
    this.rowTable = new BasicTable(name);
    if (from) {
      this.rowTable.header = from[0];
      this.rowTable.rows.push(from[1]);
    } else {
      this.rowTable.rows.push([]);
    }
  }

  get row(): Row {
    return this.rowTable.rows[0];
  }

  get rows(): Row[] {
    return Object.freeze(this.rowTable.rows) as Row[];
  }

  get header(): Header {
    return this.rowTable.header;
  }

  set header(header: Header) {
    this.rowTable.header = header;
  }

  public toCsvTable(): string[][] {
    return this.rowTable.toCsvTable();
  }

  pushColumn(header: Cell, row: Cell) {
    this.header.push(header);
    this.row.push(row);
  }
  pushColumns(header: Cell[], row: Cell[]) {
    this.header.push(...header);
    this.row.push(...row);
  }
}
