import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class EsignService {
  private readonly documensoApi = 'https://app.documenso.com/api/v1';
  private readonly documensoToken = 'api_9344yetb66p0lfpv';

  async sendForSignature(pdfPath: string, recipientEmail: string) {
    try {
      const createDocumentResponse = await axios.post(
        `${this.documensoApi}/documents`,
        {
          title: 'Test Document',
          externalId: `${Date.now()}`,
          recipients: [
            {
              name: 'Role 3 User',
              email: recipientEmail,
              role: 'SIGNER',
              signingOrder: 0,
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

      const documentData = createDocumentResponse?.data;

      console.log('Full Documenso API Response:', createDocumentResponse?.data);

      if (
        !documentData ||
        !documentData.documentId ||
        !documentData.uploadUrl
      ) {
        throw new HttpException(
          'Documenso API did not return valid document ID or upload URL.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const documentId: string = documentData.documentId;
      const uploadUrl: string = documentData.uploadUrl;

      console.log(`Document ID: ${documentId}, Upload URL: ${uploadUrl}`);

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

      return {
        message: 'Document sent for signature successfully',
        documentId: documentId,
        data: sendResponse.data,
      };
    } catch (error) {
      console.error(error);

      throw new HttpException(
        error.response?.data?.message ||
          'Failed to send document for signature',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
