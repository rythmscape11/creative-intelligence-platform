"""
OpenCV Deterministic Vision Analysis - Mission 4
Computes repeatable, numerical measurements from images.
NO AI involved - pure computer vision.
"""
import cv2
import numpy as np
from typing import Dict, Any, List, Tuple
from dataclasses import dataclass
import structlog

logger = structlog.get_logger()


@dataclass
class VisionSignal:
    """A single deterministic measurement."""
    name: str
    value: float
    unit: str
    confidence: float = 1.0
    raw_data: Dict[str, Any] = None


class OpenCVAnalyzer:
    """
    Deterministic image analysis using OpenCV.
    Produces repeatable, numerical signals.
    """
    
    def __init__(self):
        self.target_size = (1024, 1024)
    
    def analyze(self, image_path: str) -> Dict[str, VisionSignal]:
        """
        Run all deterministic analyses on an image.
        Returns dictionary of signal_name -> VisionSignal.
        """
        # Load image
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"Could not load image: {image_path}")
        
        # Resize for consistent analysis
        img = self._resize_image(img)
        
        # Convert to different color spaces
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
        
        signals = {}
        
        # === BRIGHTNESS & CONTRAST ===
        signals.update(self._analyze_brightness_contrast(gray))
        
        # === COLOR ANALYSIS ===
        signals.update(self._analyze_colors(img, hsv))
        
        # === COMPOSITION ===
        signals.update(self._analyze_composition(gray, img))
        
        # === TEXT DENSITY (from edges) ===
        signals.update(self._analyze_edges(gray))
        
        # === SALIENCY ===
        signals.update(self._analyze_saliency(img))
        
        # === WHITE SPACE ===
        signals.update(self._analyze_whitespace(gray))
        
        # === SYMMETRY ===
        signals.update(self._analyze_symmetry(gray))
        
        # === VISUAL COMPLEXITY / NOISE ===
        signals.update(self._analyze_noise(gray))
        
        logger.info("opencv_analysis_complete", signal_count=len(signals))
        return signals
    
    def _resize_image(self, img: np.ndarray) -> np.ndarray:
        """Resize image to target size while maintaining aspect ratio."""
        h, w = img.shape[:2]
        target_w, target_h = self.target_size
        
        scale = min(target_w / w, target_h / h)
        new_w, new_h = int(w * scale), int(h * scale)
        
        return cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
    
    def _analyze_brightness_contrast(self, gray: np.ndarray) -> Dict[str, VisionSignal]:
        """Analyze brightness and contrast from grayscale image."""
        signals = {}
        
        # Mean brightness (0-255)
        brightness_mean = float(np.mean(gray))
        signals["brightness_mean"] = VisionSignal(
            name="brightness_mean",
            value=brightness_mean,
            unit="level_0_255",
            raw_data={"min": float(np.min(gray)), "max": float(np.max(gray))}
        )
        
        # Brightness variance (indicates dynamic range)
        brightness_variance = float(np.var(gray))
        signals["brightness_variance"] = VisionSignal(
            name="brightness_variance",
            value=brightness_variance,
            unit="variance"
        )
        
        # Contrast ratio (RMS contrast)
        contrast_rms = float(np.std(gray))
        signals["contrast_rms"] = VisionSignal(
            name="contrast_rms",
            value=contrast_rms,
            unit="std_dev"
        )
        
        # Michelson contrast
        img_min, img_max = float(np.min(gray)), float(np.max(gray))
        if (img_max + img_min) > 0:
            michelson_contrast = (img_max - img_min) / (img_max + img_min)
        else:
            michelson_contrast = 0
        signals["contrast_michelson"] = VisionSignal(
            name="contrast_michelson",
            value=michelson_contrast,
            unit="ratio_0_1"
        )
        
        return signals
    
    def _analyze_colors(self, img: np.ndarray, hsv: np.ndarray) -> Dict[str, VisionSignal]:
        """Analyze color properties."""
        signals = {}
        
        # Mean saturation
        saturation_mean = float(np.mean(hsv[:, :, 1]))
        signals["saturation_mean"] = VisionSignal(
            name="saturation_mean",
            value=saturation_mean,
            unit="level_0_255"
        )
        
        # Saturation variance (indicates color vibrancy variation)
        saturation_variance = float(np.var(hsv[:, :, 1]))
        signals["saturation_variance"] = VisionSignal(
            name="saturation_variance",
            value=saturation_variance,
            unit="variance"
        )
        
        # Color count (unique colors via clustering)
        color_count = self._count_dominant_colors(img)
        signals["color_count"] = VisionSignal(
            name="color_count",
            value=color_count,
            unit="count"
        )
        
        # Dominant color coverage
        dominant_coverage = self._dominant_color_coverage(img)
        signals["dominant_color_coverage"] = VisionSignal(
            name="dominant_color_coverage",
            value=dominant_coverage,
            unit="percentage"
        )
        
        # Color temperature (warm vs cool)
        color_temp = self._analyze_color_temperature(img)
        signals["color_temperature"] = VisionSignal(
            name="color_temperature",
            value=color_temp,
            unit="score_-100_100"  # negative=cool, positive=warm
        )
        
        return signals
    
    def _count_dominant_colors(self, img: np.ndarray, n_colors: int = 8) -> int:
        """Count number of distinct dominant colors using k-means."""
        pixels = img.reshape(-1, 3).astype(np.float32)
        
        # Sample for speed
        sample_size = min(10000, len(pixels))
        indices = np.random.choice(len(pixels), sample_size, replace=False)
        pixels = pixels[indices]
        
        criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.2)
        
        # Try different k values, count significant clusters
        best_k = 1
        for k in range(2, n_colors + 1):
            _, labels, centers = cv2.kmeans(pixels, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
            
            # Count clusters with >5% of pixels
            unique, counts = np.unique(labels, return_counts=True)
            significant = sum(1 for c in counts if c / len(labels) > 0.05)
            
            if significant >= k:
                best_k = k
        
        return best_k
    
    def _dominant_color_coverage(self, img: np.ndarray) -> float:
        """Calculate percentage of image covered by dominant color."""
        pixels = img.reshape(-1, 3).astype(np.float32)
        
        # Single cluster k-means
        criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.2)
        _, labels, centers = cv2.kmeans(pixels, 3, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
        
        unique, counts = np.unique(labels, return_counts=True)
        max_coverage = max(counts) / len(labels) * 100
        
        return float(max_coverage)
    
    def _analyze_color_temperature(self, img: np.ndarray) -> float:
        """Analyze color temperature (-100=cool blue, +100=warm orange)."""
        b, g, r = cv2.split(img)
        
        # Simple warm/cool calculation based on red vs blue
        warm_score = float(np.mean(r) - np.mean(b))
        # Normalize to -100 to 100 range
        temp = np.clip(warm_score / 255 * 200, -100, 100)
        
        return float(temp)
    
    def _analyze_composition(self, gray: np.ndarray, img: np.ndarray) -> Dict[str, VisionSignal]:
        """Analyze visual composition and layout."""
        signals = {}
        h, w = gray.shape
        
        # Rule of thirds alignment
        thirds_score = self._rule_of_thirds_score(gray)
        signals["rule_of_thirds_alignment"] = VisionSignal(
            name="rule_of_thirds_alignment",
            value=thirds_score,
            unit="score_0_100"
        )
        
        # Visual weight distribution (center vs edges)
        center_weight = self._center_weight_ratio(gray)
        signals["center_weight_ratio"] = VisionSignal(
            name="center_weight_ratio",
            value=center_weight,
            unit="ratio"
        )
        
        # Quadrant balance
        balance_score = self._quadrant_balance(gray)
        signals["quadrant_balance"] = VisionSignal(
            name="quadrant_balance",
            value=balance_score,
            unit="score_0_100"
        )
        
        return signals
    
    def _rule_of_thirds_score(self, gray: np.ndarray) -> float:
        """Calculate how well key elements align with rule of thirds."""
        h, w = gray.shape
        
        # Define thirds lines
        h_thirds = [h // 3, 2 * h // 3]
        w_thirds = [w // 3, 2 * w // 3]
        
        # Find high-contrast regions (potential focal points)
        edges = cv2.Canny(gray, 50, 150)
        
        # Score based on edge density near thirds intersections
        score = 0
        total_edge_density = np.sum(edges) / (h * w)
        
        if total_edge_density > 0:
            margin = min(h, w) // 10
            for hy in h_thirds:
                for wx in w_thirds:
                    region = edges[max(0, hy-margin):min(h, hy+margin),
                                   max(0, wx-margin):min(w, wx+margin)]
                    region_density = np.sum(region) / (region.size) if region.size > 0 else 0
                    score += region_density / total_edge_density
            
            # Normalize to 0-100
            score = min(score / 4 * 100, 100)
        
        return float(score)
    
    def _center_weight_ratio(self, gray: np.ndarray) -> float:
        """Calculate visual weight in center vs edges."""
        h, w = gray.shape
        
        # Define center region (middle 50%)
        ch1, ch2 = h // 4, 3 * h // 4
        cw1, cw2 = w // 4, 3 * w // 4
        
        # Use gradient magnitude as visual weight
        sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
        sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
        magnitude = np.sqrt(sobelx**2 + sobely**2)
        
        center_weight = np.mean(magnitude[ch1:ch2, cw1:cw2])
        total_weight = np.mean(magnitude)
        
        if total_weight > 0:
            ratio = center_weight / total_weight
        else:
            ratio = 1.0
        
        return float(ratio)
    
    def _quadrant_balance(self, gray: np.ndarray) -> float:
        """Calculate balance across four quadrants."""
        h, w = gray.shape
        mid_h, mid_w = h // 2, w // 2
        
        # Calculate mean intensity for each quadrant
        q1 = np.mean(gray[:mid_h, :mid_w])
        q2 = np.mean(gray[:mid_h, mid_w:])
        q3 = np.mean(gray[mid_h:, :mid_w])
        q4 = np.mean(gray[mid_h:, mid_w:])
        
        quadrants = [q1, q2, q3, q4]
        mean_q = np.mean(quadrants)
        
        # Lower variance = more balanced
        variance = np.var(quadrants)
        max_variance = (255 ** 2) / 4  # Maximum possible variance
        
        balance_score = (1 - variance / max_variance) * 100
        
        return float(balance_score)
    
    def _analyze_edges(self, gray: np.ndarray) -> Dict[str, VisionSignal]:
        """Analyze edge density and clutter."""
        signals = {}
        
        # Edge detection
        edges = cv2.Canny(gray, 50, 150)
        
        # Edge density (percentage of edge pixels)
        edge_density = np.sum(edges > 0) / edges.size * 100
        signals["edge_density"] = VisionSignal(
            name="edge_density",
            value=edge_density,
            unit="percentage"
        )
        
        # Clutter index (high edge density = cluttered)
        clutter_index = min(edge_density * 2, 100)  # Scale to 0-100
        signals["clutter_index"] = VisionSignal(
            name="clutter_index",
            value=clutter_index,
            unit="score_0_100"
        )
        
        # Contour count (approximation of element count)
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        # Filter small contours
        significant_contours = [c for c in contours if cv2.contourArea(c) > 100]
        signals["element_count"] = VisionSignal(
            name="element_count",
            value=len(significant_contours),
            unit="count"
        )
        
        return signals
    
    def _analyze_saliency(self, img: np.ndarray) -> Dict[str, VisionSignal]:
        """Analyze visual saliency using a simple gradient-based method.
        
        Note: cv2.saliency requires opencv-contrib-python which may not be installed.
        This uses a simpler approach based on gradient magnitude and color contrast.
        """
        signals = {}
        
        try:
            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Simple saliency based on gradient magnitude
            sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
            sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
            magnitude = np.sqrt(sobelx**2 + sobely**2)
            
            # Normalize to 0-255
            saliency_map = cv2.normalize(magnitude, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
            
            # Apply Gaussian blur to smooth
            saliency_map = cv2.GaussianBlur(saliency_map, (21, 21), 0)
            
            # Mean saliency
            saliency_mean = float(np.mean(saliency_map))
            signals["saliency_mean"] = VisionSignal(
                name="saliency_mean",
                value=saliency_mean,
                unit="level_0_255"
            )
            
            # Saliency concentration (how focused is attention?)
            saliency_variance = float(np.var(saliency_map))
            signals["saliency_concentration"] = VisionSignal(
                name="saliency_concentration",
                value=saliency_variance,
                unit="variance"
            )
            
            # Peak saliency location (relative to center)
            peak_y, peak_x = np.unravel_index(np.argmax(saliency_map), saliency_map.shape)
            h, w = saliency_map.shape
            center_distance = np.sqrt((peak_x - w/2)**2 + (peak_y - h/2)**2)
            max_distance = np.sqrt((w/2)**2 + (h/2)**2)
            saliency_centrality = (1 - center_distance / max_distance) * 100
            
            signals["saliency_centrality"] = VisionSignal(
                name="saliency_centrality",
                value=saliency_centrality,
                unit="score_0_100",
                raw_data={"peak_x": int(peak_x), "peak_y": int(peak_y)}
            )
            
        except Exception as e:
            # If saliency analysis fails, provide default values
            logger.warning("saliency_analysis_failed", error=str(e))
            signals["saliency_mean"] = VisionSignal(
                name="saliency_mean", value=50.0, unit="level_0_255", confidence=0.5
            )
            signals["saliency_concentration"] = VisionSignal(
                name="saliency_concentration", value=1000.0, unit="variance", confidence=0.5
            )
            signals["saliency_centrality"] = VisionSignal(
                name="saliency_centrality", value=50.0, unit="score_0_100", confidence=0.5
            )
        
        return signals
    
    def _analyze_whitespace(self, gray: np.ndarray) -> Dict[str, VisionSignal]:
        """Analyze white/empty space in the image."""
        signals = {}
        
        # Threshold for "white" (high brightness, low variance)
        # Use local variance to detect uniform regions
        kernel_size = 15
        local_mean = cv2.blur(gray.astype(np.float32), (kernel_size, kernel_size))
        local_sq_mean = cv2.blur((gray.astype(np.float32))**2, (kernel_size, kernel_size))
        local_variance = local_sq_mean - local_mean**2
        
        # White space = bright + uniform
        is_bright = gray > 200
        is_uniform = local_variance < 100
        white_space = is_bright & is_uniform
        
        white_space_pct = np.sum(white_space) / white_space.size * 100
        signals["white_space_percentage"] = VisionSignal(
            name="white_space_percentage",
            value=white_space_pct,
            unit="percentage"
        )
        
        # General empty space (uniform regions regardless of color)
        empty_space_pct = np.sum(is_uniform) / is_uniform.size * 100
        signals["empty_space_percentage"] = VisionSignal(
            name="empty_space_percentage",
            value=empty_space_pct,
            unit="percentage"
        )
        
        return signals
    
    def _analyze_symmetry(self, gray: np.ndarray) -> Dict[str, VisionSignal]:
        """Analyze horizontal and vertical symmetry."""
        signals = {}
        h, w = gray.shape
        
        # Horizontal symmetry (left-right)
        left = gray[:, :w//2]
        right = np.fliplr(gray[:, w//2:])
        
        # Ensure same size
        min_w = min(left.shape[1], right.shape[1])
        left = left[:, :min_w]
        right = right[:, :min_w]
        
        h_symmetry = 1 - np.mean(np.abs(left.astype(float) - right.astype(float))) / 255
        signals["horizontal_symmetry"] = VisionSignal(
            name="horizontal_symmetry",
            value=h_symmetry * 100,
            unit="score_0_100"
        )
        
        # Vertical symmetry (top-bottom)
        top = gray[:h//2, :]
        bottom = np.flipud(gray[h//2:, :])
        
        min_h = min(top.shape[0], bottom.shape[0])
        top = top[:min_h, :]
        bottom = bottom[:min_h, :]
        
        v_symmetry = 1 - np.mean(np.abs(top.astype(float) - bottom.astype(float))) / 255
        signals["vertical_symmetry"] = VisionSignal(
            name="vertical_symmetry",
            value=v_symmetry * 100,
            unit="score_0_100"
        )
        
        return signals
    
    def _analyze_noise(self, gray: np.ndarray) -> Dict[str, VisionSignal]:
        """Analyze image noise and visual complexity."""
        signals = {}
        
        # Laplacian variance (measure of focus/detail/noise)
        laplacian = cv2.Laplacian(gray, cv2.CV_64F)
        laplacian_var = float(np.var(laplacian))
        
        signals["laplacian_variance"] = VisionSignal(
            name="laplacian_variance",
            value=laplacian_var,
            unit="variance"
        )
        
        # High frequency noise estimation
        # Difference between original and gaussian blurred
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        noise = np.abs(gray.astype(float) - blurred.astype(float))
        noise_level = float(np.mean(noise))
        
        signals["noise_level"] = VisionSignal(
            name="noise_level",
            value=noise_level,
            unit="level"
        )
        
        # Visual complexity (entropy-based)
        hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
        hist = hist.flatten() / hist.sum()
        # Remove zeros for log calculation
        hist = hist[hist > 0]
        entropy = -np.sum(hist * np.log2(hist))
        
        signals["visual_entropy"] = VisionSignal(
            name="visual_entropy",
            value=entropy,
            unit="bits"
        )
        
        return signals
    
    def get_signal_dict(self, signals: Dict[str, VisionSignal]) -> Dict[str, Any]:
        """Convert signals to plain dict for JSON serialization."""
        return {
            name: {
                "value": signal.value,
                "unit": signal.unit,
                "confidence": signal.confidence,
                "raw_data": signal.raw_data
            }
            for name, signal in signals.items()
        }


# Convenience function
def analyze_image(image_path: str) -> Dict[str, Any]:
    """
    Analyze an image and return structured signals.
    """
    analyzer = OpenCVAnalyzer()
    signals = analyzer.analyze(image_path)
    return analyzer.get_signal_dict(signals)
