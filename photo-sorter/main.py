# CSCI 4831-5722 Final Project
# Image Sorting using bag of visual words
# Submitted to Dr. Ioana Fleming
# By Khaled Hossain

import cv2
import numpy
import pathlib
from sklearn.cluster import MiniBatchKMeans
from sklearn.metrics.pairwise import linear_kernel
from sklearn.feature_extraction.text import TfidfTransformer
import json

images = tuple(pathlib.Path('./images').glob('*.jpg'))
sorted_images = []
features = list()
histograms = list()
clusters = {}
cluster_map = {}

def calc_descriptor(path):
    # Use AKAZE local features to detect and match keypoints
    akaze = cv2.AKAZE_create()
    img = cv2.imread(str(path))
    size = (320, 240)
    if img.shape[0] > img.shape[1]:
        resized_img = cv2.resize(img, (size[1], size[1] * img.shape[0] // img.shape[1]))
    else:
        resized_img = cv2.resize(img, (size[0] * img.shape[1] // img.shape[0], size[0]))
    kp, descriptor = akaze.detectAndCompute(resized_img, None)
    descriptor = descriptor.astype(numpy.float32)
    return descriptor


print('Sorting Images')

for i, path in enumerate(images):
    print('Calculating features for image {0}'.format(i + 1))
    try:
        descriptor = calc_descriptor(path)
        features += list(descriptor)
    except TypeError as e:
        print(e)
features = numpy.array(tuple(features))

print('Done Calculating features.')
print('Beginning Calculating visual words')

kmeans = MiniBatchKMeans(n_clusters=200)
visual_words = kmeans.fit(features).cluster_centers_

print('Done Calculating visual words and beginning Calculating histograms.')

for i, path in enumerate(images):
    histogram = numpy.zeros(visual_words.shape[0])
    for descriptor in calc_descriptor(path):
        histogram[((visual_words - descriptor) ** 2).sum(axis=1).argmin()] += 1
    histograms.append(histogram)
print('Finished Calculating histograms')

# Term-frequency times inverse document-frequency
tfidf = TfidfTransformer(smooth_idf=False)
histograms = tfidf.fit_transform(histograms)

print('Beginning Calculating similarities')

for i, path in enumerate(images):
    cosine_similarities = linear_kernel(histograms[i:i + 1], histograms).flatten()
    nears = []
    for j, path_j in enumerate(images):
        similarity = cosine_similarities[j]
        nears.append({'id': j, 'similarity': similarity, 'path': str(path_j)})
        nears.sort(key=lambda x: x['similarity'], reverse=True)
    sorted_images.append(nears)
print('Finished Calculating similarities')

print('Beginning clustering')

kmeans = MiniBatchKMeans(n_clusters=5)
model = kmeans.fit(histograms)
centers = model.cluster_centers_

for i, path in enumerate(images):
    cluster_id = model.predict(histograms[i])[0]
    if cluster_id not in clusters:
        clusters[int(cluster_id)] = []

    center = centers[cluster_id]
    vector = histograms[i].toarray()[0]
    distance = numpy.linalg.norm(vector - center)
    clusters[int(cluster_id)].append({'id': i, 'path': str(path), 'distance': distance})
    clusters[int(cluster_id)].sort(key=lambda x: x['distance'])

    cluster_map[str(i)] = int(cluster_id)

print('Finished clustering')


data = {'sorted_images': sorted_images, 'clusters': clusters, 'cluster_map': cluster_map}

with open('./models/data.json', 'w') as json_file:
    json.dump(data, json_file)

# Create Menu
# Show options
# outdoor sceness
# text documents
# images containing cars
# images containing sky
# images containing flowers
