import React from 'react';
import { FunnelLayout } from '@/components/subscription/FunnelLayout';
import { getDonationConfig, resolveDonationSelection } from '@/lib/donation-config';
import { DonatePaymentClient } from './DonatePaymentClient';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function DonatePayPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const config = await getDonationConfig();
  const selection = resolveDonationSelection(config, query);

  return (
    <FunnelLayout step={3} title="Pagamento">
      <DonatePaymentClient
        selection={selection}
        methods={config.paymentMethods}
        pix={config.pix}
      />
    </FunnelLayout>
  );
}
