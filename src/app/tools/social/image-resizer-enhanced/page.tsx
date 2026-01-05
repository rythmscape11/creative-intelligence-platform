'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getImagePreset, getAllPresets, SocialPlatform, resizeImageFile, ResizedImageResult } from '@/lib/tools/social/imageResizer';
import { trackToolUsage } from '@/lib/utils/toolUsageTracker';
import { Image as ImageIcon } from 'lucide-react';
import {
  FAQSection,
  TableOfContents,
  QuickAnswer,
  HowToSchema,
  SoftwareApplicationSchema,
  BreadcrumbSchema,
  ContentSection,
  RelatedTools,
} from '@/components/seo';
import { imageResizerContent } from '@/data/tools/image-resizer-content';

export default function imageResizerEnhancedPage() {
  const { metadata, hero, tableOfContents, howToSteps, faqs, relatedTools, quickAnswer } = imageResizerContent;

  // Tool state and logic
  const [platform, setPlatform] = useState<SocialPlatform>('instagram-post');
  const [preset, setPreset] = useState(getImagePreset('instagram-post'));
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<ResizedImageResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [isResizing, setIsResizing] = useState(false);


  const handlePlatformChange = (value: SocialPlatform) => {
    setPlatform(value);
    const newPreset = getImagePreset(value);
    setPreset(newPreset);

    if (resizedImage) {
      setResizedImage(null);
    }
  };
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  useEffect(() => {
    return () => {
      if (resizedImage?.url) {
        URL.revokeObjectURL(resizedImage.url);
      }
    };
  }, [resizedImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setUploadedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload a valid image file.');
      return;
    }

    setUploadError(null);
    setUploadedFile(file);
    setResizedImage(null);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleResize = async () => {
    if (!uploadedFile) {
      setUploadError('Upload an image before resizing.');
      return;
    }

    // Client-side resizing prevents the misleading “resizer” label from acting as a static guide.
    setUploadError(null);
    setIsResizing(true);

    try {
      const resized = await resizeImageFile({
        file: uploadedFile,
        targetWidth: preset.width,
        targetHeight: preset.height,
        mode: fitMode,
      });
      setResizedImage(resized);
    } catch (err) {
      console.error('Image resize failed', err);
      setUploadError(err instanceof Error ? err.message : 'Unable to resize the image.');
      setResizedImage(null);
    } finally {
      setIsResizing(false);
    }
  };

  const handleDownload = () => {
    if (!resizedImage) return;
    const link = document.createElement('a');
    link.href = resizedImage.url;
    link.download = `${preset.platform}-${preset.type}-${preset.width}x${preset.height}.png`;
    link.click();
  };

  const allPresets = getAllPresets();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: 'Social Tools', url: '/tools#social' },
          { name: metadata.title, url: '/tools/social/image-resizer' },
        ]}
      />

      <HowToSchema
        name="How to Use Social Media Image Resizer"
        description={metadata.description}
        steps={howToSteps}
      />

      <SoftwareApplicationSchema
        name={metadata.title}
        description={metadata.description}
        url="https://mediaplanpro.com/tools/social/image-resizer"
        applicationCategory="BusinessApplication"
        offers={{
          price: '0',
          priceCurrency: 'USD',
        }}
      />

      <ToolLayout
        title={metadata.title}
        description={metadata.description}
        category="social"
      >
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              {hero.title}
            </h1>
            <p className="text-xl text-text-secondary mb-6">
              {hero.subtitle}
            </p>

            {/* Tool Interface - MOVED TO TOP */}
            <section className="bg-bg-secondary rounded-lg shadow-sm border border-border-primary p-6 sm:p-8 mb-12">
              <div className="space-y-6">

                <div>
                  <Label htmlFor="platform">Select Platform & Type *</Label>
                  <Select value={platform} onValueChange={(value) => handlePlatformChange(value as SocialPlatform)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose a preset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram-post">Instagram - Post (Square)</SelectItem>
                      <SelectItem value="instagram-story">Instagram - Story</SelectItem>
                      <SelectItem value="facebook-post">Facebook - Post</SelectItem>
                      <SelectItem value="facebook-cover">Facebook - Cover Photo</SelectItem>
                      <SelectItem value="twitter-post">Twitter - Post</SelectItem>
                      <SelectItem value="twitter-header">Twitter - Header</SelectItem>
                      <SelectItem value="linkedin-post">LinkedIn - Post</SelectItem>
                      <SelectItem value="linkedin-cover">LinkedIn - Cover Photo</SelectItem>
                      <SelectItem value="youtube-thumbnail">YouTube - Thumbnail</SelectItem>
                      <SelectItem value="pinterest-pin">Pinterest - Pin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-50 to-amber-50 rounded-lg border-2 border-purple-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <ImageIcon className="w-8 h-8 text-purple-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">
                        {preset.platform} - {preset.type}
                      </h3>
                      <p className="text-sm text-text-secondary">Optimal dimensions</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-bg-secondary rounded-lg">
                      <p className="text-sm text-text-secondary mb-1">Width</p>
                      <p className="text-2xl font-bold text-purple-400">{preset.width}px</p>
                    </div>
                    <div className="text-center p-3 bg-bg-secondary rounded-lg">
                      <p className="text-sm text-text-secondary mb-1">Height</p>
                      <p className="text-2xl font-bold text-purple-400">{preset.height}px</p>
                    </div>
                    <div className="text-center p-3 bg-bg-secondary rounded-lg">
                      <p className="text-sm text-text-secondary mb-1">Ratio</p>
                      <p className="text-2xl font-bold text-purple-400">{preset.aspectRatio}</p>
                    </div>
                  </div>

                  <div className="bg-bg-secondary p-4 rounded-lg">
                    <h4 className="font-semibold text-text-primary mb-2">💡 Quick Tips:</h4>
                    <ul className="text-sm text-text-secondary space-y-1">
                      <li>• Use high-resolution images for best quality</li>
                      <li>• Maintain aspect ratio to avoid distortion</li>
                      <li>• Optimize file size (under 1MB recommended)</li>
                      <li>• Use PNG for graphics, JPG for photos</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4 border border-border-primary rounded-lg p-4 bg-bg-tertiary">
                  <div>
                    <Label htmlFor="imageUpload">Upload Image *</Label>
                    <Input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mt-1"
                    />
                    {uploadError && (
                      <p className="mt-2 text-sm text-error" role="alert">
                        {uploadError}
                      </p>
                    )}
                  </div>

                  {previewUrl && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border border-border-primary bg-bg-secondary p-4">
                        <p className="mb-2 text-sm text-text-secondary">Original Preview</p>
                        <img src={previewUrl} alt="Uploaded image preview" className="w-full rounded object-contain" />
                      </div>
                      <div className="rounded-lg border border-border-primary bg-bg-secondary p-4">
                        <p className="mb-2 text-sm text-text-secondary">Resized Preview</p>
                        {resizedImage ? (
                          <>
                            <img src={resizedImage.url} alt="Resized output preview" className="w-full rounded object-contain" />
                            <p className="mt-2 text-xs text-text-secondary">
                              {resizedImage.width}×{resizedImage.height}px{' '}
                              {resizedImage.requiresCropping && (
                                <span className="text-amber-500">• Cropped to maintain aspect ratio</span>
                              )}
                            </p>
                            <Button variant="secondary" size="sm" className="mt-3" onClick={handleDownload}>
                              Download Resized Image
                            </Button>
                          </>
                        ) : (
                          <p className="text-sm text-text-secondary">Click "Resize Image" to generate the optimized size.</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="smartCrop"
                      checked={fitMode === 'cover'}
                      onCheckedChange={(checked) => setFitMode(checked === true ? 'cover' : 'contain')}
                    />
                    <Label htmlFor="smartCrop" className="text-sm text-text-secondary">
                      Smart crop to maintain aspect ratio (recommended)
                    </Label>
                  </div>

                  <Button onClick={handleResize} disabled={!uploadedFile || isResizing}>
                    {isResizing ? 'Resizing...' : 'Resize Image'}
                  </Button>
                </div>

                <div className="pt-6 border-t border-border-primary">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">
                    All Platform Dimensions
                  </h3>
                  <div className="grid gap-3">
                    {allPresets.map((p, index) => (
                      <div
                        key={index}
                        className="p-4 bg-bg-secondary rounded-lg border border-border-primary flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-text-primary">
                            {p.platform} - {p.type}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {p.width} × {p.height}px ({p.aspectRatio})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

          </div>



          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <TableOfContents items={tableOfContents} />
            </div>

            <div className="lg:col-span-3 space-y-12">
              {/* Quick Answer Box */}
              <QuickAnswer
                question={quickAnswer.question}
                answer={quickAnswer.answer}
              />
              <ContentSection
                id="how-to-use"
                title="How to Use the Image Resizer"
              >
                <p className="text-text-secondary leading-relaxed mb-4">
                  Correctly sized images look professional and perform better. Our resizer helps you:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-text-secondary">
                  {howToSteps.map((step, index) => (
                    <li key={index}>
                      <strong>{step.name}:</strong> {step.text}
                    </li>
                  ))}
                </ol>
              </ContentSection>

              <FAQSection
                toolName="Image Resizer"
                faqs={faqs}
              />

              <ContentSection
                id="related-tools"
                title="Related Social Tools"
              >
                <RelatedTools tools={relatedTools} />
              </ContentSection>
            </div>
          </div>
        </div>
      </ToolLayout>
    </>
  );
}
