from keras.models import load_model
import cv2
import numpy as np
import base64

image_width = 299
image_height=299
classes_names = ['COVID', 'Lung_Opacity', 'Normal', 'Viral Pneumonia']
model = load_model('./data/finalModel/finalmodel.h5')

model.compile(loss="categorical_crossentropy", optimizer="adam",
                metrics=["accuracy"])



def get_pred(im_b64_string):
    im_bytes = base64.b64decode(im_b64_string)
    im_arr = np.frombuffer(im_bytes, dtype=np.uint8)  # im_arr is one-dim Numpy array 

    img = cv2.imdecode(im_arr, flags=cv2.IMREAD_GRAYSCALE)

    img = cv2.resize(img,(image_width,image_height))
    img = img/255.0

    img = img.reshape(1,image_width,image_height,1)

    prediction = model.predict(img)
    return classes_names[np.argmax(prediction)]