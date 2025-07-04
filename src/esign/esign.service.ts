import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as FormData from 'form-data';

@Injectable()
export class EsignService {
  private documensoApi = 'https://app.documenso.com/api/v1';
  private documensoToken = 'api_9344yetb66p0lfpv';

  async sendForSignature(pdfPath: string, signerEmail: string) {
    try {
      const file = fs.createReadStream(pdfPath);
      const formData = new FormData();

      // Required fields based on Documenso API structure
      formData.append('file', file);
      formData.append('name', 'Test Document'); // You can make this dynamic
      formData.append(
        'recipients',
        JSON.stringify([
          { email: signerEmail, name: 'Signer User' }, // You can make name dynamic if needed
        ]),
      );
      formData.append('message', 'Please sign this document.');

      const response = await axios.post(
        `${this.documensoApi}/documents`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${this.documensoToken}`,
            ...formData.getHeaders(),
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Documenso API Error:', error.response?.data || error);
      throw new HttpException(
        'Failed to send document to Documenso',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
