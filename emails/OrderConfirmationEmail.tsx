import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Row,
    Column,
} from '@react-email/components';
import * as React from 'react';

export interface OrderConfirmationEmailProps {
    customerName?: string; // Optional customer name if available
    customerEmail: string;
    orderId: string; // Stripe Session ID or your internal Order ID if preferred
    orderDate: string; // Formatted date
    totalAmount: string; // Formatted total amount with currency
    lineItems: {
        quantity: number;
        description: string;
        unitPrice: string; // Formatted unit price with currency
        totalPrice: string; // Formatted total price for the line item
    }[];
    shopName?: string; // Your shop's name
    shopAddress?: string; // Your shop's address
    shopUrl?: string; // Link to your shop
    logoUrl?: string; // URL to your shop's logo
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}` : 'http://localhost:3000';

export const OrderConfirmationEmail = ({
    customerName,
    orderId,
    orderDate,
    totalAmount,
    lineItems,
    shopName = 'Putec s.r.o.', // Default shop name
    shopAddress = 'Pezinská 154, 902 01 Vinosady, Slovensko', // Default shop address
    shopUrl = baseUrl,
    logoUrl = 'https://jfmssfymrewzbnsbynxd.supabase.co/storage/v1/object/public/product-images/public/logo/logoputec%20(1).webp' // Default logo
}: OrderConfirmationEmailProps) => (
    <Html>
        <Head />
        <Preview>Potvrdenie objednávky č. {orderId} z {shopName}</Preview>
        <Body style={main}>
            <Container style={container}>
                {logoUrl && (
                    <Section style={logoContainer}>
                         {/* Center the image using margin auto */}
                         <Img src={logoUrl} width="120" height="auto" alt={`${shopName} Logo`} style={{ margin: '0 auto' }} />
                    </Section>
                )}
                <Heading style={h1}>Ďakujeme za Vašu objednávku!</Heading>
                <Text style={text}>
Dobrý deň{customerName ? ` ${customerName}` : ''},
                </Text>
                <Text style={text}>
                    Ďakujeme za Vašu nedávnu objednávku č. <strong>{orderId}</strong> zo dňa {orderDate} z obchodu {shopName}.
                    Nižšie nájdete súhrn Vašej objednávky:
                </Text>

                <Section style={{ marginTop: '20px' }}> 
                     <Row style={tableHeader}>
                        <Column style={{ ...tableColumn, textAlign: 'left' }}>Popis</Column>
                        <Column style={{ ...tableColumn, width: '80px', textAlign: 'right' }}>Množ.</Column> 
                        <Column style={{ ...tableColumn, width: '120px', textAlign: 'right' }}>Cena/ks</Column>
                        <Column style={{ ...tableColumn, width: '120px', textAlign: 'right' }}>Spolu</Column>
                    </Row>

                    {lineItems.map((item, index) => (
                        <Row key={index} style={tableRow}>
                            <Column style={{ ...tableCell, textAlign: 'left' }}>{item.description}</Column>
                            <Column style={{ ...tableCell, width: '80px', textAlign: 'right' }}>{item.quantity}</Column> 
                            <Column style={{ ...tableCell, width: '120px', textAlign: 'right' }}>{item.unitPrice}</Column> 
                            <Column style={{ ...tableCell, width: '120px', textAlign: 'right' }}>{item.totalPrice}</Column> 
                        </Row>
                    ))}
                </Section>

                <Hr style={hr} />

                <Section style={{ marginTop: '20px' }}>
                    <Row>
                        <Column style={{ ...totalLabel, textAlign: 'right', paddingRight: '10px' }}>Celková suma:</Column>
                        <Column style={{ ...totalValue, width: '120px', textAlign: 'right' }}>{totalAmount}</Column>
                    </Row>
                </Section>

                <Hr style={hr} />

                <Text style={text}>
                    Ak máte akékoľvek otázky, odpovedzte na tento email alebo nás kontaktujte na <Link href={`mailto:info@putec.sk`}>info@putec.sk</Link>. {/* Replace with your actual contact email if different */}
                </Text>
                <Text style={footerText}>
                    S pozdravom,
                    <br />
                    Tím {shopName}
                </Text>

                <Hr style={hr} />
                <Section style={footer}>
                    <Text style={footerTextSmall}>
                         {shopName} | {shopAddress} | <Link href={shopUrl} style={footerLink}>{shopUrl}</Link>
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default OrderConfirmationEmail;

// --- Základné štýly --- Styles can be customized further

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    padding: '20px 0',
};

const container = {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
    margin: '0 auto',
    padding: '20px',
    width: '580px',
    maxWidth: '100%',
};

const logoContainer = {
    margin: '20px 0',
    textAlign: 'center' as const, // Ensure logo section is centered
};

const h1 = {
    color: '#1d1c1d',
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '30px 0',
    padding: '0',
    textAlign: 'center' as const,
};

const text = {
    color: '#333',
    fontSize: '14px',
    lineHeight: '24px',
    margin: '16px 0',
};

const hr = {
    borderColor: '#cccccc',
    margin: '20px 0',
};

const tableHeader = {
    borderBottom: '1px solid #eaeaea',
    padding: '8px 0',
    backgroundColor: '#f8f8f8', // Light background for header
};

const tableRow = {
    borderBottom: '1px solid #eaeaea',
};

const tableColumn = {
    padding: '10px 8px', 
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#555',
    // textAlign is set inline based on column type
};

const tableCell = {
    padding: '10px 8px', 
    fontSize: '12px',
    verticalAlign: 'middle', // Align content vertically
    // textAlign is set inline based on column type
};

const totalLabel = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    // width: 'auto', // Let it take available space before the value
};

const totalValue = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    // width and textAlign set inline
};

const footer = {
    marginTop: '20px',
};

const footerText = {
    color: '#333',
    fontSize: '14px',
    lineHeight: '24px',
};

const footerTextSmall = {
    color: '#555',
    fontSize: '12px',
    lineHeight: '18px',
    textAlign: 'center' as const,
};

const footerLink = {
    color: '#067df7',
    textDecoration: 'underline',
};
