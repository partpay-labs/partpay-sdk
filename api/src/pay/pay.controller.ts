import { Body, Controller, Get, Options, Param, Post, UseInterceptors } from '@nestjs/common';
import { CorsInterceptor } from './cors.interceptor';
import { ActionGetResponse, ActionPostRequest, ActionPostResponse } from '@solana/actions';
import { PayService } from './pay.service';

@Controller('pay/action')
@UseInterceptors(CorsInterceptor)
export class PayController {
    constructor(private readonly payService: PayService) {}

    @Get(':pubkey')
    async getPaymentAction(@Param('pubkey') pubkey: string): Promise<ActionGetResponse> {
        return this.payService.getPaymentAction(pubkey);
    }

    @Post(':pubkey/full')
    async fullPayment(
        @Param('pubkey') pubkey: string, 
        @Body() body: ActionPostRequest
    ): Promise<ActionPostResponse> {
        return this.payService.createFullPaymentTransaction(body, pubkey);
    }

    @Post(':pubkey/installments')
    async installmentPayment(
        @Param('pubkey') pubkey: string,
        @Body('account') body: ActionPostRequest,
        @Body('installmentPlan') installmentPlan: string
    ): Promise<ActionPostResponse> {
        return this.payService.createInstallmentPlanTransaction(pubkey,body,parseInt(installmentPlan)
        );
    }

    @Options()
    handleOptions() {
        return '';
    }
}