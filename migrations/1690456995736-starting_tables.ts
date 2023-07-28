import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class StartingTables1690456995736 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userTable = new Table({
      name: 'user',
      columns: [
        { name: 'id', isPrimary: true, type: 'serial' },
        { name: 'name', type: 'varchar', length: '255' },
        { name: 'email', type: 'varchar', length: '255', isUnique: true },
        { name: 'password', type: 'varchar', length: '255' },
        { name: 'mobile_phone', type: 'varchar', length: '255', isUnique: true },
        { name: 'is_active', type: 'boolean', default: false },
        { name: 'created_at', type: 'timestamp', default: 'now()' },
        { name: 'updated_at', type: 'timestamp', default: 'now()' },
      ],
      indices: [{ columnNames: ['email'], isUnique: true }],
    });

    await queryRunner.createTable(userTable);

    const accountConfirmationTable = new Table({
      name: 'account_confirmation',
      columns: [
        { name: 'id', isPrimary: true, type: 'serial' },
        { name: 'user_id', type: 'int' },
        { name: 'code', type: 'varchar', length: '6' },
        { name: 'is_valid', type: 'boolean', default: true },
        { name: 'expires_at', type: 'timestamp' },
        { name: 'created_at', type: 'timestamp', default: 'now()' },
        { name: 'updated_at', type: 'timestamp', default: 'now()' },
      ],
      foreignKeys: [
        {
          columnNames: ['user_id'],
          referencedTableName: 'user',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        },
      ],
      indices: [
        { columnNames: ['code'] },
        { isUnique: true, columnNames: ['is_valid', 'code'], where: 'is_valid = true' },
        { isUnique: true, columnNames: ['user_id', 'is_valid'], where: 'is_valid = true' },
      ],
    });

    await queryRunner.createTable(accountConfirmationTable);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('account_confirmation');
    await queryRunner.dropTable('user');
  }
}
