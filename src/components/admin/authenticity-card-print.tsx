import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

/**
 * Print-ready physical insert (approx. 90 × 120mm card stock). Hidden on
 * screen, revealed only for print. Copy is deliberately limited to claims the
 * verification record can substantiate.
 */
export function AuthenticityCardPrint({ cardRef, verifyUrl }: { cardRef: string; verifyUrl: string }) {
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // High error correction + 4-module quiet zone keeps it scannable at ~28mm.
    void QRCode.toDataURL(verifyUrl, {
      errorCorrectionLevel: 'H',
      margin: 4,
      scale: 12,
      color: { dark: '#000000', light: '#FFFFFF' },
    }).then((url) => {
      if (!cancelled) setQr(url);
    });
    return () => {
      cancelled = true;
    };
  }, [verifyUrl]);

  return (
    <div id="authenticity-card" className="hidden print:block print:text-black">
      <div className="mx-auto w-[90mm] border border-black/70 bg-white p-[8mm] text-center">
        <p className="text-[7pt] uppercase tracking-[0.32em]">Skin Grocer</p>
        <div className="mx-auto mt-[3mm] h-px w-[18mm] bg-[#b08d57]" />

        <p className="mt-[5mm] font-display text-[15pt] leading-tight">
          Authenticity, without the guesswork
        </p>
        <p className="mt-[2mm] text-[8pt] uppercase tracking-[0.22em]">Verified by Skin Grocer</p>

        <div className="mt-[6mm] flex justify-center">
          {qr ? (
            <img src={qr} alt="" className="h-[32mm] w-[32mm]" />
          ) : (
            <div className="h-[32mm] w-[32mm] border border-black/30" />
          )}
        </div>

        <p className="mt-[4mm] text-[8pt]">Scan to view this order&rsquo;s verification record.</p>

        <p className="mt-[5mm] text-[7pt] uppercase tracking-[0.2em]">Card reference</p>
        <p className="mt-[1mm] font-mono text-[11pt] tracking-[0.12em]">{cardRef}</p>

        <div className="mx-auto mt-[5mm] h-px w-[30mm] bg-black/20" />
        <p className="mt-[3mm] break-all text-[6.5pt] text-black/70">{verifyUrl}</p>
        <p className="mt-[2mm] text-[6.5pt] text-black/70">customercare@skingrocer.com.au</p>
      </div>
    </div>
  );
}
