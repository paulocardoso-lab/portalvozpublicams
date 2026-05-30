'use server';

import prisma from '@/lib/prisma';
import { Plan } from '@prisma/client';
import { z } from 'zod';

const subscriptionSchema = z.object({
  email: z.string().email('E-mail inválido'),
  name: z.string().min(3, 'Nome muito curto'),
  cpf: z.string().min(11, 'CPF inválido'),
  amount: z.number().min(5, 'Valor mínimo R$ 5'),
  planName: z.string(),
  isMonthly: z.boolean().default(true),
});

export async function createSubscription(formData: FormData) {
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  const cpf = formData.get('cpf') as string;
  const amountStr = formData.get('amount') as string;
  const planName = formData.get('planName') as string;
  const isMonthly = formData.get('isMonthly') === 'true';

  const amount = parseFloat(amountStr.replace('R$', '').replace(',', '.').trim());

  const validated = subscriptionSchema.safeParse({ 
    email, 
    name, 
    cpf, 
    amount, 
    planName, 
    isMonthly 
  });

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    const normalizedPlan = planName.toUpperCase();
    const plan = Object.values(Plan).includes(normalizedPlan as Plan) ? (normalizedPlan as Plan) : Plan.CUSTOM;

    // 1. Criar ou atualizar usuário
    const user = await prisma.user.upsert({
      where: { email },
      update: { name, cpf },
      create: { 
        email, 
        name, 
        cpf,
        role: 'READER',
        status: 'ACTIVE'
      },
    });

    // 2. Criar a assinatura (Simulado para o Pagar.me/Stripe)
    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan,
        status: 'ACTIVE',
        amount: Math.round(amount * 100), // Armazenar em centavos
        method: 'CARD', 
      }
    });

    // 3. Registrar no Audit Log
    await prisma.auditLog.create({
      data: {
        action: 'SUBSCRIPTION_CREATED',
        target: `User: ${user.id}`,
        userId: user.id,
        status: 'SUCCESS',
        details: { plan: planName, amount }
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Subscription error:', error);
    return { error: 'Ocorreu um erro ao processar sua assinatura.' };
  }
}
