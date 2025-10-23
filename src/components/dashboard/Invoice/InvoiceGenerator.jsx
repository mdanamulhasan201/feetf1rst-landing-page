'use client'
import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';

// Fetch image as dataURL and also return its natural dimensions to preserve aspect ratio when drawing
async function fetchImageInfo(imageUrl) {
    if (!imageUrl) return { dataUrl: null, width: 0, height: 0 };
    try {
        const response = await fetch(imageUrl, { mode: 'cors' });
        const blob = await response.blob();
        const dataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });

        // Load into Image to read intrinsic size
        const imgDims = await new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
            img.onerror = () => resolve({ width: 0, height: 0 });
            img.src = dataUrl;
        });

        return { dataUrl, ...imgDims };
    } catch {
        return { dataUrl: null, width: 0, height: 0 };
    }
}

function formatGermanDate(dateString) {
    try {
        return new Date(dateString).toLocaleDateString('de-DE');
    } catch {
        return '';
    }
}

export default function InvoiceGenerator({ order }) {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        if (!order) return;
        setDownloading(true);
        try {
            const doc = new jsPDF({ unit: 'mm', format: 'a4' });

            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 10;

            // Colors
            const green = '#27ae60';
            const gray = '#666666';
            const lightGray = '#e6e6e6';

            // Header bar
            doc.setDrawColor(lightGray);
            doc.setFillColor(245, 245, 245);
            doc.rect(5, 6, pageWidth - 10, 18, 'F');

            // Logo (left aligned)
            doc.setTextColor(30, 30, 30);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);
            doc.text('FEETF1RST', margin + 2, 18);

            // Order date (right aligned, same vertical position as logo)
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(gray);
            const dateText = `Auftragsdatum: ${formatGermanDate(order.createdAt)}`;
            const dateWidth = doc.getTextWidth(dateText);
            doc.text(dateText, pageWidth - margin - dateWidth, 17);

            // Content start
            let y = 30;

            // Product image box
            const productImgUrl = order?.maßschaft_kollektion?.image;
            const { dataUrl: productImgData, width: natW, height: natH } = await fetchImageInfo(productImgUrl);
            doc.setDrawColor(200);
            const boxW = 65; // enlarged box
            const boxH = 65;
            const boxX = margin + 2;
            const boxY = y;
            doc.roundedRect(boxX, boxY, boxW, boxH, 4, 4);
            if (productImgData && natW > 0 && natH > 0) {
                // Fit image with padding while preserving aspect ratio
                const padding = 4; // mm
                const maxW = boxW - padding * 2;
                const maxH = boxH - padding * 2;
                const ratio = Math.min(maxW / natW, maxH / natH);
                const drawW = natW * ratio;
                const drawH = natH * ratio;
                const drawX = boxX + (boxW - drawW) / 2;
                const drawY = boxY + (boxH - drawH) / 2;
                // Try jpg first, fall back to PNG
                const format = productImgData.startsWith('data:image/png') ? 'PNG' : 'JPEG';
                doc.addImage(productImgData, format, drawX, drawY, drawW, drawH, undefined, 'FAST');
            }
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(20, 20, 20);
            doc.setFontSize(12);
            // doc.text(`${order?.maßschaft_kollektion?.ide || ''}`, margin + 2, y + boxH + 7);

            // Right column: customer name and model (centered with image)
            const rightX = margin + 2 + boxW + 12;
            const centerY = y + boxH / 2;

            // Helper function to draw dashed lines
            const drawDashedLine = (x1, y1, x2, y2, dashLength = 2, gapLength = 1) => {
                doc.setDrawColor(lightGray);
                const totalLength = x2 - x1;
                const dashPattern = dashLength + gapLength;
                const numDashes = Math.floor(totalLength / dashPattern);

                for (let i = 0; i < numDashes; i++) {
                    const startX = x1 + (i * dashPattern);
                    const endX = startX + dashLength;
                    doc.line(startX, y1, endX, y2);
                }
            };

            doc.setFontSize(11);
            doc.setTextColor(30, 30, 30);

            // Nome cliente with dashed line after colon
            const clienteText = 'Nome cliente:';
            doc.text(clienteText, rightX, centerY - 8);
            const clienteLabelWidth = doc.getTextWidth(clienteText);
            const clienteDashStartX = rightX + clienteLabelWidth;
            drawDashedLine(clienteDashStartX, centerY - 5, pageWidth - margin, centerY - 5);

            // Modello with dashed line after colon
            const modelloText = 'Modello:';
            doc.text(modelloText, rightX, centerY + 8);
            const modelloLabelWidth = doc.getTextWidth(modelloText);
            const modelloDashStartX = rightX + modelloLabelWidth;
            drawDashedLine(modelloDashStartX, centerY + 11, pageWidth - margin, centerY + 11);

            // Details list with dashed lines
            y += 80;
            doc.setTextColor(30, 30, 30);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);

            const detailFields = [
                { label: 'Pelle scelta:', value: order?.lederType || '' },
                { label: 'Colore & tipo:', value: order?.lederfarbe || '' },
                { label: 'Fodera interna:', value: order?.innenfutter || '' },
                {
                    label: 'Colore cuciture:',
                    value: order?.nahtfarbe || order?.nahtfarbe_text || ''
                },
                { label: 'Altezza desiderata:', value: order?.schafthohe || '' },
                {
                    label: 'Aggiunte (es. rinforzi):',
                    value: `${order?.vestarkungen || ''}${order?.vestarkungen_text ? ` - ${order.vestarkungen_text}` : ''}`
                },
            ];

            let detailsY = y;
            detailFields.forEach((field) => {
                // Draw label and data together
                const fullText = `${field.label} ${field.value}`;
                doc.text(fullText, margin + 2, detailsY);

                // Calculate where the colon ends to start dashed line from there
                const labelText = `${field.label} `;
                const labelWidth = doc.getTextWidth(labelText);
                const dashStartX = margin + 2 + labelWidth;

                // Draw dashed line starting from after the colon
                drawDashedLine(dashStartX, detailsY + 3, pageWidth - margin, detailsY + 3);
                detailsY += 8;
            });

            // Address block
            detailsY += 6;
            doc.setFont('helvetica', 'bold');
            doc.text('Indirizzo di consegna:', margin + 2, detailsY);
            doc.setFont('helvetica', 'normal');
            const address = [
                'FeetF1rst GmbH',
                'Pipenstrasse 5, 39031 Brunico',
                'Bolzano / Italia',
            ];
            address.forEach((line, idx) => {
                doc.text(line, margin + 2, detailsY + 6 + idx * 6);
            });

            // Footer bar
            const footerY = 280;
            doc.setFillColor(98, 160, 123);
            doc.rect(0, footerY, pageWidth, 17, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text('Tel: 342 6412573', margin, footerY + 11);
            doc.text('info@feetf1rst.com', pageWidth / 2 - 15, footerY + 11);
            doc.text('FeetF1rst GmbH', pageWidth - margin - 32, footerY + 11);

            const fileName = `Rechnung_${order?.orderNumber || order?.id}.pdf`;
            doc.save(fileName);
        } catch (e) {
            console.error(e);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Button onClick={handleDownload} disabled={downloading} className="bg-[#62A07B] hover:bg-[#62A07B]/90 text-white cursor-pointer">
            {downloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileDown className="h-4 w-4 mr-2" />}
            Rechnung herunterladen
        </Button>
    );
}


