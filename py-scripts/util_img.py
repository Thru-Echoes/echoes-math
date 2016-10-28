
import numpy as np
import pandas as pd

###########################################################################################
###########################################################################################
###########################################################################################
# Working Directories

import os

def getWorkDir():
    return os.getcwd()

def setWordDir(newPath):
    os.chdir(newPath)
    print("\nNew working directory: ", os.getcwd())
    return True

###########################################################################################
###########################################################################################
###########################################################################################
# Image Processing

import numpy as np
import matplotlib.pyplot as plt
import skimage

from scipy.ndimage import convolve
from sklearn import linear_model, datasets, metrics
from sklearn.model_selection import train_test_split
from sklearn.neural_network import BernoulliRBM
from sklearn.pipeline import Pipeline
from skimage import data

def show_images(images, titles = None, interpolation = 'nearest'):
    """See an array of images plotted nicely.

    Parameters
    ==========
    images : array (list)
        A 1-D array (list) of images to plot.

    titles : int
        ...

    interpolation : string
        ...

    Returns
    =======
    foo : array
        1-d real array representing the leads for individuals within a
        simulated population of Beta distributions.
    """

    n_ims = len(images)
    if titles is None: titles = ['(%d)' % i for i in range(1, n_ims + 1)]
    fig = plt.figure()
    n = 1
    for image, title in zip(images, titles):
        a = fig.add_subplot(1 ,n_ims, n)
        if image.ndim == 2: plt.gray()
        plt.imshow(image, interpolation = interpolation)
        a.set_title(title)
        n += 1
    fig.set_size_inches(np.array(fig.get_size_inches()) * n_ims)
    plt.show()


def montage_wb_ratio (input_image, patch_shape, n_filters, ele_print = False):

    from skimage.util.shape import view_as_windows
    from skimage.util.montage import montage2d
    from scipy.cluster.vq import kmeans2

    patches = view_as_windows(gray_crab, patch_shape)

    patches = patches.reshape(-1, patch_shape[0] * patch_shape[1])[::8]

    fb, _ = kmeans2(patches, n_filters, minit='points')

    fb = fb.reshape((-1,) + patch_shape)

    fb_montage = montage2d(fb, fill=False, rescale_intensity=True)

    elements = np.split(np.hstack(np.split(fb_montage, 4)), 16, axis=1)

    del elements[n_filters:]

    wb_ratios = []

    bin_elements = []

    for element in elements:

        thresh = threshold_otsu(element)

        binary = element > thresh

        ratio = np.sum(binary) / binary.size

        wb_ratios.append(ratio)

        if ele_print:
            bin_elements.append(binary)

    wb_ratios = sorted(wb_ratios, reverse = True)

    if ele_print:

        show_images(elements)
        show_images(bin_elements)

    return(wb_ratios)

def show_images(images, titles = None):
    """Display a list of images"""
    n_ims = len(images)
    if titles is None: titles = ['(%d)' % i for i in range(1,n_ims + 1)]
    fig = plt.figure()
    n = 1
    for image,title in zip(images, titles):
        a = fig.add_subplot(1,n_ims,n) # Make subplot
        if image.ndim == 2: # Is image grayscale?
            plt.gray() # Only place in this blog you can't replace 'gray' with 'grey'
        plt.imshow(image)
        a.set_title(title)
        n += 1
    fig.set_size_inches(np.array(fig.get_size_inches()) * n_ims)
    plt.show()


def getRestoredImg(iimg):
    iimg_restore = restoration.denoise_bilateral(iimg)
    return iimg_restore

def getExposedImg(iimg, hEnhance = False):
    if hEnhance:
        iimg_equ = exposure.equalize_adapthist(iimg)
    else:
        iimg_equ = exposure.equalize_hist(iimg)
    return iimg_equ

def print_cv_score_summary(model, xx, yy, cv):
    scores = cross_val_score(model, xx, yy, cv=cv, n_jobs=1)
    print("mean: {:3f}, stdev: {:3f}".format(
        np.mean(scores), np.std(scores)))

def splitScale(ddat, nPart):
    try:
        from sklearn.model_selection import train_test_split
    except:
        print("Could not import sklearn.cross_validation for train_test_split")

    np.random.shuffle(ddat)
    numObs = ddat.shape[0]
    numCol = ddat.shape[1] - 1
    xddat = ddat[:, 1:numCol]
    yddat = ddat[:, numCol]

    # remember: many methods work better on scaled X
    xScaled = preprocessing.scale(xddat)
    xTrain, xTest, yTrain, yTest = train_test_split(xScaled, yddat, train_size = nPart, random_state = 1738)
    #xddat.iloc[xTrain] # return dataframe train
    return (xTrain, xTest, yTrain, yTest)

from os import listdir
from time import time
from pylab import imread

#setWorkDir(os.path.join(os.getcwd(), '..'))
MYDIRECTORY = os.getcwd()

def most_frequent_colour(image):

    w, h = image.size
    pixels = image.getcolors(w * h)

    most_frequent_pixel = pixels[0]

    for count, colour in pixels:
        if count > most_frequent_pixel[0]:
            most_frequent_pixel = (count, colour)

    return most_frequent_pixel[1]

def get_multi_feats(image_path_list):
    feature_list = []
    for image_path in image_path_list:
        img_og = imread(image_path)
        feat_size = img_og.size

        img_r = img_og[:, :, 0]
        img_g = img_og[:, :, 1]
        img_b = img_og[:, :, 2]

        # Contrast stretching
        p2, p98 = np.percentile(img_og, (2, 98))
        r_rescale = exposure.rescale_intensity(img_r, in_range = (p2, p98))
        g_rescale = exposure.rescale_intensity(img_g, in_range = (p2, p98))
        b_rescale = exposure.rescale_intensity(img_b, in_range = (p2, p98))

        # Equalization
        r_eq = exposure.equalize_hist(img_r)
        g_eq = exposure.equalize_hist(img_g)
        b_eq = exposure.equalize_hist(img_b)

        # Adaptive Equalization
        r_adapteq = exposure.equalize_adapthist(img_r, clip_limit = 0.03)
        g_adapteq = exposure.equalize_adapthist(img_g, clip_limit = 0.03)
        b_adapteq = exposure.equalize_adapthist(img_b, clip_limit = 0.03)

        # Summary Statistics


        #top_pixel = pixels[0]
        #for count, color in feat_pixels:
        #    if count > top_pixel[0]:
        #        top_pixel = (count, color)
        #feat_dom = top_pixel[1]

        feature_list.append([image_path, feat_size, r_rescale, r_eq, r_adapteq])
    return feature_list

def get_channel_summary(img):
    img_r = img[:, :, 0]
    img_g = img[:, :, 1]
    img_b = img[:, :, 2]

    r_mean = np.mean(img_r)
    r_median = np.median(img_r)
    r_std = np.std(img_r)
    r_var = np.var(img_r)

    g_mean = np.mean(img_g)
    g_median = np.median(img_g)
    g_std = np.std(img_g)
    g_var = np.var(img_g)

    b_mean = np.mean(img_b)
    b_median = np.median(img_b)
    b_std = np.std(img_b)
    b_var = np.var(img_b)

    return list([r_mean, r_median, r_std, r_var, g_mean, g_median, g_std, g_var, b_mean, b_median, b_std, b_var])

# setWorkDir(os.path.join(os.getcwd(), 'unicorn'))



###########################################################################################
###########################################################################################
###########################################################################################
