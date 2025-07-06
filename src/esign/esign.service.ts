import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class EsignService {
  private documensoApi = 'https://app.documenso.com/api/v1';
  private documensoToken = 'api_9344yetb66p0lfpv';

  async sendForSignature(pdfPath: string, role3Email: string) {
    try {
      // Step 1: Create Document Metadata
      const createDocumentResponse = await axios.post(
        `${this.documensoApi}/documents`,
        {
          title: 'Test Document',
          externalId: `${Date.now()}`, // Custom ID (you can pass anything unique)
          recipients: [
            {
              name: 'Role 3 User',
              email: role3Email,
              role: 'SIGNER', // Should be 'SIGNER' as per Documenso API
              signingOrder: 0, // Signing order (use 0 if order doesn’t matter)
            },
          ],
          meta: {
            subject: 'Please sign this document.',
            message: 'This document requires your signature.',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.documensoToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const documentId = createDocumentResponse.data?.id;
      const uploadUrl = createDocumentResponse.data?.uploadUrl;

      console.log(documentId, 'Vansh Sharma');

      if (!documentId || !uploadUrl) {
        throw new HttpException(
          'Failed to retrieve document ID or upload URL.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const fileBuffer = fs.readFileSync(pdfPath);
      await axios.put(uploadUrl, fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Length': fileBuffer.length,
        },
      });

      const sendResponse = await axios.post(
        `${this.documensoApi}/documents/${documentId}/send`,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.documensoToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return sendResponse.data;
    } catch (error) {
      console.error('Documenso API Error:', error.response?.data || error);
      throw new HttpException(
        error.response?.data?.message ||
          'Failed to send document for signature',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
