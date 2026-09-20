'use client';

import React, { useState } from 'react';
import {
  OrdersHeader,
  OrdersStatsCards,
  OrdersFilterBar,
  OrdersTable,
  NewOrderModal,
} from './components';
import { initialOrdersList } from './ordersData';
import { OrderRow } from './types';

export default function OrdersView() {
  const [orders, setOrders] = useState<OrderRow[]>(initialOrdersList);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.table.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.server.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAddOrder = (newOrder: OrderRow) => {
    setOrders([newOrder, ...orders]);
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Order ID,Table,Customer,Items,Server,Time,Status,Total']
        .concat(
          orders.map(
            (o) =>
              `${o.id},${o.table},"${o.customer}",${o.items},"${o.server}",${o.time},${o.status},${o.total}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `orders_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewAll = () => {
    setStatusFilter('All');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 w-full pb-10">
      {/* 1. Page Header with Title, Subtitle, Export & New Order buttons */}
      <OrdersHeader
        onExport={handleExport}
        onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
      />

      {/* 2. Top 4 Metric Summary Cards */}
      <OrdersStatsCards orders={orders} />

      {/* 3. Status Filter Tabs & Search Bar */}
      <OrdersFilterBar
        orders={orders}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* 4. Orders Data Table with Status Badges and Pagination */}
      <OrdersTable
        orders={filteredOrders}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onViewAll={handleViewAll}
      />

      {/* 5. Interactive Create New Order Modal */}
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        onAddOrder={handleAddOrder}
      />
    </div>
  );
}
