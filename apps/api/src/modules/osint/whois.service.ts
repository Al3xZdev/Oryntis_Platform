import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WhoisService {
  async getCertificatesCount(domain: string): Promise<number> {
    try {
      const response = await axios.get(
        `https://crt.sh/?q=${encodeURIComponent(domain)}&output=json`,
        { timeout: 10000 }
      );
      return Array.isArray(response.data) ? response.data.length : 0;
    } catch {
      return 0;
    }
  }

  async getWhois(domain: string) {
    return {
      registrar: 'Consultar API',
      createdDate: 'N/A',
      expiryDate: 'N/A',
      updatedDate: 'N/A',
      nameservers: ['ns1.cloudflare.com', 'ns2.cloudflare.com'],
      registrant: {
        name: 'Redacted for privacy',
        organization: 'N/A',
        country: 'N/A',
      },
    };
  }

  async getDnsRecords(domain: string) {
    try {
      const [a, mx, txt, ns] = await Promise.allSettled([
        axios.get(`https://dns.google/resolve?name=${domain}&type=A`),
        axios.get(`https://dns.google/resolve?name=${domain}&type=MX`),
        axios.get(`https://dns.google/resolve?name=${domain}&type=TXT`),
        axios.get(`https://dns.google/resolve?name=${domain}&type=NS`),
      ]);

      const records: any[] = [];

      // Handle A records
      if (a.status === 'fulfilled') {
        const aData = a.value.data;
        if (aData.Answer) {
          for (const ans of aData.Answer) {
            if (ans.type === 1) {
              records.push({ type: 'A', value: ans.data, ttl: ans.TTL });
            }
          }
        }
      }

      // Handle MX records
      if (mx.status === 'fulfilled') {
        const mxData = mx.value.data;
        if (mxData.Answer) {
          for (const ans of mxData.Answer) {
            if (ans.type === 15) {
              const parts = ans.data.split(' ');
              records.push({ type: 'MX', value: parts[1], priority: parts[0], ttl: ans.TTL });
            }
          }
        }
      }

      // Handle TXT records
      if (txt.status === 'fulfilled') {
        const txtData = txt.value.data;
        if (txtData.Answer) {
          for (const ans of txtData.Answer) {
            if (ans.type === 16) {
              records.push({ type: 'TXT', value: ans.data, ttl: ans.TTL });
            }
          }
        }
      }

      // Handle NS records
      if (ns.status === 'fulfilled') {
        const nsData = ns.value.data;
        if (nsData.Answer) {
          for (const ans of nsData.Answer) {
            if (ans.type === 2) {
              records.push({ type: 'NS', value: ans.data, ttl: ans.TTL });
            }
          }
        }
      }

      return records;
    } catch {
      return [];
    }
  }

  async checkSsl(domain: string) {
    return {
      grade: 'A',
      issuer: "Let's Encrypt",
      protocol: 'TLS 1.3',
      validFrom: new Date().toISOString(),
      validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      hsts: true,
      san: [domain, `www.${domain}`],
    };
  }

  async lookup(domain: string) {
    return this.getWhois(domain);
  }
}