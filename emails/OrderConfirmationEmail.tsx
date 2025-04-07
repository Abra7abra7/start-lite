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
    shopName = 'Váš Obchod', // Default shop name
    shopAddress = 'Vaša Adresa',
    shopUrl = baseUrl,
    logoUrl // Optional: Provide URL to your logo
}: OrderConfirmationEmailProps) => (
    <Html>
        <Head />
        <Preview>Potvrdenie objednávky č. {orderId} z {shopName}</Preview>
        <Body style={main}>
            <Container style={container}>
                {logoUrl && (
                    <Section style={logoContainer}>
                         <Img src={logoUrl} width="120" height="auto" alt={`${shopName} Logo`} />
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

                <Section style={tableContainer}>
                     <Row style={tableHeader}>
                        <Column style={columnHeader}>Položka</Column>
                        <Column style={columnHeaderQty}>Množstvo</Column>
                        <Column style={columnHeaderPrice}>Cena/ks</Column>
                        <Column style={columnHeaderPriceTotal}>Spolu</Column>
                    </Row>
                    {lineItems.map((item, index) => (
                        <Row key={index} style={tableRow}>
                            <Column style={tableCell}>{item.description}</Column>
                            <Column style={tableCellQty}>{item.quantity}</Column>
                            <Column style={tableCellPrice}>{item.unitPrice}</Column>
                            <Column style={tableCellPriceTotal}>{item.totalPrice}</Column>
                        </Row>
                    ))}
                </Section>

                <Hr style={hr} />

                <Section style={totalSection}>
                     <Row>
                        <Column style={totalLabel}>Celková suma:</Column>
                        <Column style={totalValue}>{totalAmount}</Column>
                    </Row>
                </Section>

                <Hr style={hr} />

                <Text style={text}>
                    Ak máte akékoľvek otázky, odpovedzte na tento email alebo nás kontaktujte na <Link href={`mailto:info@vasadomena.sk`}>info@vasadomena.sk</Link>. {/* Replace with your actual contact email */}
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
    textAlign: 'center' as const,
    marginBottom: '20px',
}

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

const tableContainer = {
    borderCollapse: 'collapse' as const,
    width: '100%',
};

const tableHeader = {
    backgroundColor: '#f2f2f2',
};

const columnHeader = {
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: 'bold',
    textAlign: 'left' as const,
    borderBottom: '1px solid #dddddd',
};

const columnHeaderQty = { ...columnHeader, textAlign: 'center' as const };
const columnHeaderPrice = { ...columnHeader, textAlign: 'right' as const };
const columnHeaderPriceTotal = { ...columnHeader, textAlign: 'right' as const };

const tableRow = {
     borderBottom: '1px solid #eeeeee',
};

const tableCell = {
    padding: '8px 12px',
    fontSize: '14px',
    textAlign: 'left' as const,
};

const tableCellQty = { ...tableCell, textAlign: 'center' as const };
const tableCellPrice = { ...tableCell, textAlign: 'right' as const };
const tableCellPriceTotal = { ...tableCell, textAlign: 'right' as const };


const totalSection = {
    paddingTop: '10px',
};

const totalLabel = {
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'right' as const,
    paddingRight: '10px',
    width: '80%'
};

const totalValue = {
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'right' as const,
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
