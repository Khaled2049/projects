from flask import Flask, request, jsonify, send_file
from diffusers import StableDiffusionPipeline
import torch
from io import BytesIO

if torch.cuda.is_available():
    device = torch.device("cuda")
    print("Using CUDA (NVIDIA GPU)")
else:
    device = torch.device("cpu")
    print("CUDA not available, using CPU")


# Model ID
model_id = "prompthero/openjourney-v4"

try:
    # Set up the pipeline with optimizations
    pipe = StableDiffusionPipeline.from_pretrained(model_id)
    pipe = pipe.to(device)

    # Enable optimizations
    pipe.safety_checker = None
    pipe.enable_attention_slicing()
    pipe.enable_vae_slicing()
    # need cuda baby so not on mac child
    # pipe.enable_model_cpu_offload()
except Exception as e:
    print(f"Error loading model: {e}")
    raise

# Create the Flask app
app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def generate_image():
    data = request.get_json()
    prompt = data.get('prompt')
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    try:
        image = pipe(
            prompt=prompt,
            num_inference_steps=20,  # Reduced from default 50
            height=512,  # Reduced from default 512
            width=512   # Reduced from default 512
        ).images[0]

        # Save the image to a BytesIO object
        img_io = BytesIO()
        image.save(img_io, 'PNG')
        img_io.seek(0)

        return send_file(img_io, mimetype='image/png')
    except Exception as e:
        return jsonify({"error": f"Image generation failed: {e}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
