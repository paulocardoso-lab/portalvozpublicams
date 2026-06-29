-- CreateIndex: User(status, role) — usado em listagens de usuários ativos por papel
CREATE INDEX "User_status_role_idx" ON "User"("status", "role");

-- CreateIndex: Transaction(subscriptionId, status) — usado em verificações de assinatura
CREATE INDEX "Transaction_subscriptionId_status_idx" ON "Transaction"("subscriptionId", "status");

-- CreateIndex: RSSFeed(isActive) — usado no cron de sincronização RSS a cada execução
CREATE INDEX "RSSFeed_isActive_idx" ON "RSSFeed"("isActive");
