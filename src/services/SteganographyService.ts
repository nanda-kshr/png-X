import axios from 'axios';

class SteganographyService {
  private baseUrl = 'http://127.0.0.1:5300'; // Adjust to your Flask backend URL

  /**
   * Encode restoration data into an image
   * @param originalImage Original image file
   * @param alteredImage Altered image file
   * @returns Encoded image details
   */
  async encodeImage(originalImage: File, alteredImage: File, width: number, height: number) {
    const formData = new FormData();
    formData.append('original_image', originalImage);
    formData.append('altered_image', alteredImage);
    
    

    try {
      const response = await axios.post(`${this.baseUrl}/encode`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Encoding error:', error);
      throw error;
    }
  }

  /**
   * Decode and restore an image with embedded restoration data
   * @param stegoImage Image with embedded restoration data
   * @returns Restored image details
   */
  async decodeImage(stegoImage: File) {
    const formData = new FormData();
    formData.append('stego_image', stegoImage);

    try {
      const response = await axios.post(`${this.baseUrl}/decode`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Decoding error:', error);
      throw error;
    }
  }

  /**
   * Download a processed image
   * @param filename Name of the file to download
   * @returns Blob of the downloaded file
   */
  async downloadFile(filename: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/download/${filename}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Clear uploaded and generated files on the server
   */
  async clearUploads() {
    try {
      const response = await axios.get(`${this.baseUrl}/clear`);
      return response.data;
    } catch (error) {
      console.error('Clear uploads error:', error);
      throw error;
    }
  }
}

export default new SteganographyService();