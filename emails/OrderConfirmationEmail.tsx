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
    orderId: string; // Stripe Session ID
    orderDate: string; // Formatted date
    totalAmount: string; // Formatted total amount with currency
    lineItems: { 
        quantity: number;
        description: string;
        unitPrice: string; // Formatted unit price with currency
        totalPrice: string; // Formatted total line price with currency
    }[];
    wineryName?: string;
    wineryAddress?: string; // Optional address
    wineryLogoUrl?: string; // Optional logo URL
    storeUrl?: string; // Link back to the store
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'; // Adjust if needed

export const OrderConfirmationEmail = ({ 
    customerName,
    customerEmail,
    orderId,
    orderDate,
    totalAmount,
    lineItems = [], // Add default value here
    wineryName = 'Rodinné vinárstvo Pútec', 
    wineryAddress = 'Pútec 123, 900 01 Vinosady', // Example address
    wineryLogoUrl = `${baseUrl}/logo.png`, // Example logo path - ADJUST IF NEEDED
    storeUrl = baseUrl,
}: OrderConfirmationEmailProps) => (
    <Html>
        <Head />
        <Preview>Potvrdenie objednávky č. {orderId} od {wineryName}</Preview>
        <Body style={main}>
            <Container style={container}>
                {/* Optional Logo */}
                {wineryLogoUrl && <Img src={wineryLogoUrl} width="150" height="auto" alt={`${wineryName} Logo`} style={logo} />}
                
                <Heading style={heading}>Ďakujeme za vašu objednávku!</Heading>
                
                <Text style={paragraph}>
                    Dobrý deň{customerName ? ` ${customerName}` : ''}, 
                </Text>
                <Text style={paragraph}>
                    Vaša objednávka v {wineryName} bola úspešne prijatá a spracovaná.
                </Text>

                <Section style={orderInfoSection}>
                    <Row>
                        <Column style={orderInfoColumnLeft}><Text style={orderInfoLabel}>Číslo objednávky:</Text></Column>
                        <Column><Text style={orderInfoValue}>{orderId}</Text></Column>
                    </Row>
                     <Row>
                        <Column style={orderInfoColumnLeft}><Text style={orderInfoLabel}>Dátum objednávky:</Text></Column>
                        <Column><Text style={orderInfoValue}>{orderDate}</Text></Column>
                    </Row>
                      <Row>
                        <Column style={orderInfoColumnLeft}><Text style={orderInfoLabel}>Celková suma:</Text></Column>
                        <Column><Text style={orderInfoValueBold}>{totalAmount}</Text></Column>
                    </Row>
                </Section>

                <Hr style={hr} />

                <Heading as="h2" style={subHeading}>Položky objednávky</Heading>
                
                <Section>
                    {lineItems.map((item, index) => (
                        <Row key={index} style={itemRow}>
                            <Column style={itemQuantity}>{item.quantity}x</Column>
                            <Column style={itemDescription}>{item.description}</Column>
                             <Column style={itemPrice}>{item.totalPrice}</Column>
                             {/* Optional: Show unit price too */}
                            {/* <Column style={itemPrice}><Text style={unitPriceText}>({item.unitPrice} / ks)</Text></Column> */} 
                        </Row>
                    ))}
                </Section>

                <Hr style={hr} />

                 <Text style={paragraph}>Celková suma: <span style={totalAmountFooter}>{totalAmount}</span></Text>

                <Hr style={hr} />

                <Text style={paragraph}>
                    Ak máte akékoľvek otázky, neváhajte nás kontaktovať na <Link href={`mailto:${customerEmail}?subject=Otázka k objednávke ${orderId}`} style={link}>{customerEmail}</Link>.
                </Text>
                <Text style={paragraph}>
                    Ďakujeme za Váš nákup!
                </Text>

                <Hr style={hr} />

                <Text style={footerText}>
                    {wineryName}<br />
                    {wineryAddress && <>{wineryAddress}<br /></>}
                    <Link href={storeUrl} style={link}>{storeUrl}</Link>
                </Text>
            </Container>
        </Body>
    </Html>
);

export default OrderConfirmationEmail;

// Basic Styles (can be customized further)
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    padding: '20px 0',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 40px',
    marginBottom: '64px',
    border: '1px solid #dfe1e4',
    borderRadius: '8px',
};

const logo = {
    margin: '0 auto 20px auto',
};

const heading = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#484848',
    textAlign: 'center' as const,
    marginBottom: '30px',
};

const subHeading = {
     fontSize: '20px',
    fontWeight: 'bold',
    color: '#484848',
    marginTop: '20px',
     marginBottom: '15px',
}

const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#484848',
    marginBottom: '15px',
};

const orderInfoSection = {
    marginTop: '20px',
    marginBottom: '20px',
};

const orderInfoColumnLeft = {
    width: '150px',
};

const orderInfoLabel = {
    ...paragraph,
    fontWeight: 'bold',
    marginBottom: '5px',
}

const orderInfoValue = {
    ...paragraph,
     marginBottom: '5px',
}

const orderInfoValueBold = {
    ...orderInfoValue,
    fontWeight: 'bold',
}

const hr = {
    borderColor: '#dfe1e4',
    margin: '30px 0',
};

const itemRow = {
    marginBottom: '10px',
}

const itemQuantity = {
    ...paragraph,
    width: '40px',
    textAlign: 'right' as const,
    paddingRight: '10px',
}

const itemDescription = {
     ...paragraph,
     paddingLeft: '10px',
}

const itemPrice = {
    ...paragraph,
    width: '100px',
    textAlign: 'right' as const,
}

const unitPriceText = {
    fontSize: '12px',
    color: '#5f5f5f',
}

const totalAmountFooter = {
    fontWeight: 'bold',
}

const footerText = {
    fontSize: '12px',
    color: '#8898aa',
    lineHeight: '15px',
    textAlign: 'center' as const,
    marginTop: '30px',
};

const link = {
    color: '#007bff', 
    textDecoration: 'underline',
};
