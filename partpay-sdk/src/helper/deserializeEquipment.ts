import { option, string, u16, array, u8, i64, u64, publicKey, Serializer } from "@metaplex-foundation/umi/serializers";
import { EquipmentMetadata, FinancingOption } from "../types/Equipment";

function createStructSerializer<T extends Record<string, Serializer<any, any>>>(fields: T): Serializer<{ [K in keyof T]: T[K] extends Serializer<infer U, any> ? U : never }, { [K in keyof T]: T[K] extends Serializer<any, infer V> ? V : never }> {
    return {
        description: 'Struct',
        fixedSize: null,
        maxSize: null,
        serialize: (value: any) => {
            let result = new Uint8Array();
            for (const [key, serializer] of Object.entries(fields)) {
                result = new Uint8Array([...Array.from(result), ...Array.from(serializer.serialize(value[key]))]);
            }
            return result;
        },
        deserialize: (buffer: Uint8Array, offset = 0) => {
            const result: any = {};
            for (const [key, serializer] of Object.entries(fields)) {
                const [value, newOffset] = serializer.deserialize(buffer, offset);
                result[key] = value;
                offset = newOffset;
            }
            return [result, offset];
        },
    };
}

export function deserializeEquipment(data: Uint8Array): EquipmentMetadata {
    const equipmentSerializer = createStructSerializer({
        name: string(),
        description: string(),
        sku: option(string()),
        category: option(string()),
        brand: option(string()),
        owner: publicKey(),
        vendorId: publicKey(),
        walletAddress: publicKey(),
        price: u64(),
        currency: string(),
        installmentPrice: option(u64()),
        maxNumberOfInstallments: option(u8()),
        maxPaymentDuration: option(u64()),
        stockQuantity: u64(),
        isActive: u8(),
        images: array(string()),
        image: string(),
        weight: option(u64()),
        dimensions: option(createStructSerializer({
            length: u64(),
            width: u64(),
            height: u64(),
            unit: string(),
        })),
        condition: option(u8()),
        model: option(string()),
        serialNumber: option(string()),
        manufactureDate: option(i64()),
        manufacturerWarranty: option(createStructSerializer({
            duration: u64(),
            unit: string(),
        })),
        insuranceId: option(string()),
        createdAt: option(i64()),
        updatedAt: option(i64()),
        financingOptions: array(createStructSerializer({
            termMonths: u8(),
            interestRate: u16(),
            minimumDownPayment: u64(),
        })),
    });

    const [equipment] = equipmentSerializer.deserialize(data);

    return {
        ...equipment,
        price: Number(equipment.price),
        sku: equipment.sku.__option === 'Some' ? equipment.sku.value : undefined,
        category: equipment.category.__option === 'Some' ? equipment.category.value : undefined,
        maxNumberOfInstallments: equipment.maxNumberOfInstallments.__option === 'Some' ? equipment.maxNumberOfInstallments.value : undefined,
        brand: equipment.brand.__option === 'Some' ? equipment.brand.value : undefined,
        installmentPrice: equipment.installmentPrice.__option === 'Some' ? Number(equipment.installmentPrice.value) : undefined,
        maxPaymentDuration: equipment.maxPaymentDuration.__option === 'Some' ? Number(equipment.maxPaymentDuration.value) : undefined,
        stockQuantity: Number(equipment.stockQuantity),
        isActive: equipment.isActive === 1,
        weight: equipment.weight.__option === 'Some' ? Number(equipment.weight.value) : undefined,
        insuranceId: equipment.insuranceId.__option === 'Some' ? equipment.insuranceId.value : undefined,
        dimensions: equipment.dimensions.__option === 'Some' ? {
            length: Number(equipment.dimensions.value.length),
            width: Number(equipment.dimensions.value.width),
            height: Number(equipment.dimensions.value.height),
            unit: equipment.dimensions.value.unit,
        } : undefined,
        model: equipment.model.__option === 'Some' ? equipment.model.value : undefined,
        condition: equipment.condition.__option === 'Some' ? 
            (['new', 'used', 'refurbished'] as const)[equipment.condition.value] : undefined,
        manufactureDate: equipment.manufactureDate.__option === 'Some' ? 
            new Date(Number(equipment.manufactureDate.value) * 1000) : undefined,
        manufacturerWarranty: equipment.manufacturerWarranty.__option === 'Some' ? {
            duration: Number(equipment.manufacturerWarranty.value.duration),
            unit: equipment.manufacturerWarranty.value.unit as 'days' | 'months' | 'years',
        } : undefined,
        createdAt: equipment.createdAt.__option === 'Some' ? 
            new Date(Number(equipment.createdAt.value) * 1000) : undefined,
        updatedAt: equipment.updatedAt.__option === 'Some' ? 
            new Date(Number(equipment.updatedAt.value) * 1000) : undefined,
        financingOptions: equipment.financingOptions.map((option: FinancingOption) => ({
            termMonths: option.termMonths,
            interestRate: option.interestRate,
            minimumDownPayment: BigInt(option.minimumDownPayment),
        })),
        serialNumber: equipment.serialNumber.__option === 'Some' ? equipment.serialNumber.value : undefined,
    };
}