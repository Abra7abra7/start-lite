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

interface OrderConfirmationCustomerProps {
    orderId: number;
    orderDate: string;
    customerName: string | null;
    totalPrice: string;
    items: { name: string; quantity: number; price: string }[];
    shippingAddress?: string; // Optional
    billingAddress?: string; // Optional
}

export const OrderConfirmationCustomer: React.FC<OrderConfirmationCustomerProps> = ({
    orderId,
    orderDate,
    customerName,
    totalPrice,
    items,
    shippingAddress,
    billingAddress
}) => {
    const previewText = `Potvrdenie objednávky č. ${orderId}`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white font-sans">
                    <Container className="p-6 mx-auto">
                        <Heading className="text-2xl font-bold text-center">Ďakujeme za Vašu objednávku!</Heading>
                        <Text className="text-base">
                            Ahoj {customerName ?? 'zákazník'},
                        </Text>
                        <Text className="text-base">
                            Ďakujeme za nákup v našom e-shope Pútec. Vaša objednávka č. <strong>{orderId}</strong> bola úspešne prijatá dňa {orderDate}.
                        </Text>

                        <Hr className="my-4" />

                        <Heading as="h2" className="text-xl font-semibold">Súhrn objednávky</Heading>
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

                        {/* Add shipping/billing details if available */}
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

                        <Text className="text-sm text-gray-600">
                            Ak máte akékoľvek otázky, odpovedzte na tento email alebo nás kontaktujte na [Váš Kontaktný Email alebo Telefón].
                        </Text>
                        <Text className="text-sm text-gray-600 text-center mt-4">
                           © {new Date().getFullYear()} Vinárstvo Pútec. Všetky práva vyhradené.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default OrderConfirmationCustomer;
