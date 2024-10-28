'use client';

import { type ColumnDef } from '@tanstack/react-table';
import * as React from 'react';

import type { ProjectType } from 'common/types';

export const columns: Array<ColumnDef<ProjectType>> = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'leadUserId',
    header: 'Lead',
    cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'endDate',
    header: 'Target date',
    cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
  },
];
