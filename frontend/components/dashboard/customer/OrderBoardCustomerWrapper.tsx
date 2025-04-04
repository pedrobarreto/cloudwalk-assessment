'use client';

import OrderBoard from "./OrderBoard";

export default function OrderBoardUserWrapper({ userId }: { userId: string }) {
  return <OrderBoard userId={userId} />;
}
