import React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
    Tailwind,
    Section,
    Row,
    Column,
    Hr
} from '@react-email/components';

interface OrderNotificationOwnerProps {
    orderId: number;
    orderDate: string;
    customerName: string | null;
    customerEmail: string | null;
    totalPrice: string;
    items: { name: string; quantity: number; price: string }[];
    shippingAddress?: string;
    billingAddress?: string;
}

export const OrderNotificationOwner: React.FC<OrderNotificationOwnerProps> = ({
    orderId,
    orderDate,
    customerName,
    customerEmail,
    totalPrice,
    items,
    shippingAddress,
    billingAddress
}) => {
    const previewText = `Nová objednávka č. ${orderId}`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white font-sans">
                    <Container className="p-6 mx-auto">
                        <Heading className="text-2xl font-bold text-center">Nová objednávka!</Heading>
                        <Text className="text-base">
                            Bola prijatá nová objednávka č. <strong>{orderId}</strong> dňa {orderDate}.
                        </Text>

                        <Hr className="my-4" />

                        <Heading as="h2" className="text-xl font-semibold">Detaily zákazníka</Heading>
                        <Text>Meno: {customerName ?? 'N/A'}</Text>
                        <Text>Email: {customerEmail ?? 'N/A'}</Text>

                        {shippingAddress && (
                           <>
                                <Hr className="my-4" />
                                <Heading as="h3" className="text-lg font-semibold">Doručovacia adresa</Heading>
                                <Text>{shippingAddress}</Text>
                            </>
                        )}
                         {billingAddress && shippingAddress !== billingAddress && (
                           <>
                                <Hr className="my-4" />
                                <Heading as="h3" className="text-lg font-semibold">Fakturačná adresa</Heading>
                                <Text>{billingAddress}</Text>
                            </>
                        )}

                        <Hr className="my-4" />

                        <Heading as="h2" className="text-xl font-semibold">Objednané položky</Heading>
                        <Section>
                            {items.map((item, index) => (
                                <Row key={index} className="mb-2">
                                    <Column>{item.name} (x{item.quantity})</Column>
                                    <Column className="text-right">{item.price}</Column>
                                </Row>
                            ))}
                        </Section>
                        <Hr className="my-4" />
                        <Row>
                            <Column className="font-semibold">Celkom:</Column>
                            <Column className="text-right font-semibold">{totalPrice}</Column>
                        </Row>

                         <Hr className="my-4" />

                        <Text className="text-sm text-gray-600 text-center mt-4">
                           Toto je automatická notifikácia pre majiteľa e-shopu Pútec.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default OrderNotificationOwner;
