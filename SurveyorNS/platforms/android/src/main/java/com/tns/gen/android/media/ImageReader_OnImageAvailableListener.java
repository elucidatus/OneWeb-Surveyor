package com.tns.gen.android.media;

public class ImageReader_OnImageAvailableListener implements android.media.ImageReader.OnImageAvailableListener {
	public ImageReader_OnImageAvailableListener() {
		com.tns.Runtime.initInstance(this);
	}

	public void onImageAvailable(android.media.ImageReader param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onImageAvailable", void.class, args);
	}

}
