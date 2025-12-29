import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

interface QuoteItem {
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PDFConfig {
  companyName: string;
  address: string;
  city: string;
  phone: string;
  email: string;
}

interface QuotePDFProps {
  clientName: string;
  clientAddress: string;
  clientCondominium: string;
  clientPhone: string;
  clientEmail: string;
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  total: number;
  quoteNumber?: string;
  createdAt?: Date;
  warranty?: string;
  observations?: string;
  pdfConfig?: PDFConfig;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #0F172A',
    paddingBottom: 15,
  },
  logoContainer: {
    marginBottom: 10,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 5,
  },
  companyInfo: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 20,
    marginBottom: 15,
  },
  section: {
    marginBottom: 20,
  },
  clientInfo: {
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  clientLabel: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 3,
  },
  clientValue: {
    fontSize: 10,
    color: '#0F172A',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    padding: 10,
    fontWeight: 'bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottom: '1 solid #E2E8F0',
    fontSize: 9,
  },
  tableCell: {
    flex: 1,
  },
  tableCellRight: {
    flex: 1,
    textAlign: 'right',
  },
  tableCellCenter: {
    flex: 1,
    textAlign: 'center',
  },
  summary: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F8FAFC',
    borderRadius: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    fontSize: 10,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTop: '2 solid #0F172A',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTop: '1 solid #E2E8F0',
    fontSize: 8,
    color: '#64748B',
  },
  footerTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 10,
  },
  footerText: {
    marginBottom: 5,
    lineHeight: 1.5,
  },
  signature: {
    marginTop: 40,
    paddingTop: 20,
    borderTop: '1 solid #E2E8F0',
  },
  signatureLine: {
    borderTop: '1 solid #0F172A',
    width: 300,
    marginTop: 50,
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 9,
    color: '#64748B',
  },
  validity: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FEF3C7',
    borderRadius: 5,
    fontSize: 9,
    color: '#92400E',
    textAlign: 'center',
  },
});

export function QuotePDF({
  clientName,
  clientAddress,
  clientCondominium,
  clientPhone,
  clientEmail,
  items,
  subtotal,
  discount,
  total,
  quoteNumber,
  createdAt,
  warranty,
  observations,
  pdfConfig,
}: QuotePDFProps) {
  const config = pdfConfig || {
    companyName: 'House Manutenção',
    address: 'Rua Rio Grande do Norte, 726, Savassi',
    city: 'Belo Horizonte - MG',
    phone: '(31) 98279-8513',
    email: 'contato@housemanutencao.com.br',
  };
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date?: Date) => {
    if (!date) {
      const now = new Date();
      return `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    const d = new Date(date);
    return `${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              src="/logo.png"
              style={{ width: 80, height: 80, marginBottom: 10 }}
            />
            <Text style={styles.companyName}>{config.companyName}</Text>
          </View>
          <Text style={styles.companyInfo}>
            {config.address}{'\n'}
            {config.city}{'\n'}
            Telefone: {config.phone}{'\n'}
            Email: {config.email}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>ORÇAMENTO DE SERVIÇOS</Text>

        {/* Quote Info */}
        {quoteNumber && (
          <View style={styles.section}>
            <Text style={styles.clientLabel}>Número do Orçamento:</Text>
            <Text style={styles.clientValue}>{quoteNumber}</Text>
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.clientLabel}>Data de Emissão:</Text>
          <Text style={styles.clientValue}>{formatDate(createdAt)}</Text>
        </View>

        {/* Client Info */}
        <View style={styles.clientInfo}>
          <Text style={styles.clientLabel}>CLIENTE:</Text>
          <Text style={styles.clientValue}>{clientName}</Text>
          <Text style={styles.clientLabel}>CONDOMÍNIO:</Text>
          <Text style={styles.clientValue}>{clientCondominium}</Text>
          <Text style={styles.clientLabel}>ENDEREÇO:</Text>
          <Text style={styles.clientValue}>{clientAddress}</Text>
          <Text style={styles.clientLabel}>TELEFONE:</Text>
          <Text style={styles.clientValue}>{clientPhone}</Text>
          <Text style={styles.clientLabel}>EMAIL:</Text>
          <Text style={styles.clientValue}>{clientEmail}</Text>
        </View>

        {/* Services Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { flex: 3 }]}>SERVIÇO</Text>
            <Text style={styles.tableCellCenter}>QTD</Text>
            <Text style={styles.tableCellRight}>PREÇO UNIT.</Text>
            <Text style={styles.tableCellRight}>TOTAL</Text>
          </View>
          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 3 }]}>{item.serviceName}</Text>
              <Text style={styles.tableCellCenter}>{item.quantity}</Text>
              <Text style={styles.tableCellRight}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={styles.tableCellRight}>{formatCurrency(item.total)}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text>Subtotal:</Text>
            <Text>{formatCurrency(subtotal)}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text>Desconto:</Text>
              <Text>- {formatCurrency(discount)}</Text>
            </View>
          )}
          <View style={styles.summaryTotal}>
            <Text>TOTAL:</Text>
            <Text>{formatCurrency(total)}</Text>
          </View>
        </View>

        {/* Warranty */}
        {warranty && (
          <View style={styles.validity}>
            <Text style={{ fontWeight: 'bold' }}>GARANTIA: {warranty.toUpperCase()}</Text>
          </View>
        )}

        {/* Validity */}
        <View style={styles.validity}>
          <Text style={{ fontWeight: 'bold' }}>VALIDADE: 10 DIAS</Text>
        </View>

        {/* Observations */}
        {observations && (
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>OBSERVAÇÕES:</Text>
            <Text style={styles.footerText}>{observations}</Text>
          </View>
        )}

        {/* Payment Terms */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>CONDIÇÕES DE PAGAMENTO:</Text>
          <Text style={styles.footerText}>
            • Pix: Desconto de 5% no pagamento à vista{'\n'}
            • Cartão de Crédito: Parcelamento em até 3x sem juros
          </Text>
        </View>

        {/* Legal Text */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Serviço realizado conforme normas técnicas. Garantia conforme especificado acima em todos os serviços executados.
          </Text>
        </View>

        {/* Signature */}
        <View style={styles.signature}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>{clientName}</Text>
          <Text style={styles.signatureText}>Cliente</Text>
        </View>
      </Page>
    </Document>
  );
}

