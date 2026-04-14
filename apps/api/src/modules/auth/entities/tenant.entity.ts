import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'varchar', nullable: true })
  name: string;

  @Column({ name: 'slug', type: 'varchar' })
  slug: string;

  @Column({ name: 'plan', type: 'varchar', nullable: true })
  plan: string;

  @Column({ name: 'credits_monthly', type: 'integer', nullable: true })
  creditsMonthly: number;

  @Column({ name: 'max_users', type: 'integer', nullable: true })
  maxUsers: number;

  @Column({ name: 'max_investigations', type: 'integer', nullable: true })
  maxInvestigations: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}