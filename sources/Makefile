##
## Makefile for vvgl in /home/aracthor/programs/projects/vvgl/sources
## 
## Made by aracthor
## Login   <aracthor@epitech.net>
## 
## Started on  Sat Apr 11 09:31:12 2015 aracthor
## Last Update Tue Jul  7 14:35:17 2015 Aracthor
##

CC=		cat

# Lib made
2DNAME=		vvgl2D
2DFILENAME=	lib$(2DNAME).js
3DNAME=		vvgl3D
3DFILENAME=	lib$(3DNAME).js
LIBPATH=	../
3DLIBFILE=	$(LIBPATH)$(3DFILENAME)
2DLIBFILE=	$(LIBPATH)$(2DFILENAME)

COMMON_DIR=	common/
2D_DIR=		2D/
3D_DIR=		3D/

COMMON_CORE_DIR=	$(COMMON_DIR)core/
COMMON_CORE_FILES=	Application.js	\
			core.js
COMMON_CORE_SRCS=	$(COMMON_CORE_FILES:%.js=$(COMMON_CORE_DIR)%.js)

COMMON_DATA_DIR=	$(COMMON_DIR)data/
COMMON_DATA_FILES=	Color.js
COMMON_DATA_SRCS=	$(COMMON_DATA_FILES:%.js=$(COMMON_DATA_DIR)%.js)

COMMON_ENUMS_DIR=	$(COMMON_DIR)enums/
COMMON_ENUMS_FILES=	KeyCode.js	\
			MouseButton.js
COMMON_ENUMS_SRCS=	$(COMMON_ENUMS_FILES:%.js=$(COMMON_ENUMS_DIR)%.js)

COMMON_EVENTS_DIR=	$(COMMON_DIR)events/
COMMON_EVENTS_FILES=	EventsManager.js		\
			EventsHandler.js		\
			Keyboard.js			\
			KeyEventListener.js		\
			Mouse.js			\
			MouseButtonEventListener.js	\
			MouseMovementListener.js	\
			WheelMovementListener.js
COMMON_EVENTS_SRCS=	$(COMMON_EVENTS_FILES:%.js=$(COMMON_EVENTS_DIR)%.js)

COMMON_EXCEPTIONS_DIR=		$(COMMON_DIR)exceptions/
COMMON_EXCEPTIONS_FILES=	Exception.js			\
				ImplementationException.js
COMMON_EXCEPTIONS_SRCS=		$(COMMON_EXCEPTIONS_FILES:%.js=$(COMMON_EXCEPTIONS_DIR)%.js)

COMMON_MATHS_DIR=	$(COMMON_DIR)maths/
COMMON_MATHS_FILES=	Mat3.js		\
			Mat4.js		\
			Maths.js	\
			Random.js	\
			Vec2.js		\
			Vec3.js		\
			Vec4.js
COMMON_MATHS_SRCS=	$(COMMON_MATHS_FILES:%.js=$(COMMON_MATHS_DIR)%.js)

COMMON_SCENE_DIR=	$(COMMON_DIR)scene/
COMMON_SCENE_FILES=	SceneManager.js
COMMON_SCENE_SRCS=	$(COMMON_SCENE_FILES:%.js=$(COMMON_SCENE_DIR)%.js)

COMMON_TEXTURE_DIR=	$(COMMON_DIR)texture/
COMMON_TEXTURE_FILES=	Texture.js
COMMON_TEXTURE_SRCS=	$(COMMON_TEXTURE_FILES:%.js=$(COMMON_TEXTURE_DIR)%.js)

COMMON_TIME_DIR=	$(COMMON_DIR)time/
COMMON_TIME_FILES=	Clock.js
COMMON_TIME_SRCS=	$(COMMON_TIME_FILES:%.js=$(COMMON_TIME_DIR)%.js)



2D_CORE_DIR=	$(2D_DIR)core/
2D_CORE_FILES=	Application2D.js
2D_CORE_SRCS=	$(2D_CORE_FILES:%.js=$(2D_CORE_DIR)%.js)

2D_DRAWABLE_DIR=	$(2D_DIR)drawable/
2D_DRAWABLE_FILES=	Drawable.js	\
			Arc.js		\
			Frame.js	\
			LineCap.js	\
			Line.js		\
			Rectangle.js	\
			Sprite.js	\
			Text.js
2D_DRAWABLE_SRCS=	$(2D_DRAWABLE_FILES:%.js=$(2D_DRAWABLE_DIR)%.js)

2D_SCENE_DIR=	$(2D_DIR)scene/
2D_SCENE_FILES=	SceneNode.js
2D_SCENE_SRCS=	$(2D_SCENE_FILES:%.js=$(2D_SCENE_DIR)%.js)


3D_CAMERA_DIR=		$(3D_DIR)camera/
3D_CAMERA_FILES=	Camera.js		\
			FreeFlyCamera.js	\
			TrackballCamera.js
3D_CAMERA_SRCS=		$(3D_CAMERA_FILES:%.js=$(3D_CAMERA_DIR)%.js)

3D_CORE_DIR=	$(3D_DIR)core/
3D_CORE_FILES=	Application3D.js
3D_CORE_SRCS=	$(3D_CORE_FILES:%.js=$(3D_CORE_DIR)%.js)

3D_ENUMS_DIR=	$(3D_DIR)enums/
3D_ENUMS_FILES=	RenderMode.js
3D_ENUMS_SRCS=	$(3D_ENUMS_FILES:%.js=$(3D_ENUMS_DIR)%.js)

3D_EXCEPTIONS_DIR=	$(3D_DIR)exceptions/
3D_EXCEPTIONS_FILES=	GLErrorException.js	\
			GLRessourceException.js
3D_EXCEPTIONS_SRCS=	$(3D_EXCEPTIONS_FILES:%.js=$(3D_EXCEPTIONS_DIR)%.js)

3D_INTERFACES_DIR=	$(3D_DIR)interfaces/
3D_INTERFACES_FILES=	IBindable.js	\
			SceneData.js
3D_INTERFACES_SRCS=	$(3D_INTERFACES_FILES:%.js=$(3D_INTERFACES_DIR)%.js)

3D_LIGHT_DIR=	$(3D_DIR)light/
3D_LIGHT_FILES=	Light.js		\
		AmbianceLight.js	\
		DirectionLight.js	\
		SpotLight.js
3D_LIGHT_SRCS=	$(3D_LIGHT_FILES:%.js=$(3D_LIGHT_DIR)%.js)

3D_MESH_DIR=	$(3D_DIR)mesh/
3D_MESH_FILES=	ArrayBuffer.js	\
		Mesh.js		\
		Skybox.js	\
		Axis.js
3D_MESH_SRCS=	$(3D_MESH_FILES:%.js=$(3D_MESH_DIR)%.js)

3D_RENDER_DIR=		$(3D_DIR)render/
3D_RENDER_FILES=	FrameRender.js	\
			Renderer.js
3D_RENDER_SRCS=		$(3D_RENDER_FILES:%.js=$(3D_RENDER_DIR)%.js)

3D_SHADER_DIR=		$(3D_DIR)shader/
3D_SHADER_FILES=	Attribute.js		\
			Shader.js		\
			ShaderProgram.js
3D_SHADER_SRCS=		$(3D_SHADER_FILES:%.js=$(3D_SHADER_DIR)%.js)

3D_SCENE_DIR=	$(3D_DIR)scene/
3D_SCENE_FILES=	Scene.js		\
		Transformable.js	\
		SceneNode.js
3D_SCENE_SRCS=	$(3D_SCENE_FILES:%.js=$(3D_SCENE_DIR)%.js)

3D_TEXTURE_DIR=		$(3D_DIR)texture/
3D_TEXTURE_FILES=	GLTexture.js
3D_TEXTURE_SRCS=	$(3D_TEXTURE_FILES:%.js=$(3D_TEXTURE_DIR)%.js)


COMMON_SRCS=	$(COMMON_DIR)namespace.js	\
		$(COMMON_ENUMS_SRCS)		\
		$(COMMON_EVENTS_SRCS)		\
		$(COMMON_CORE_SRCS)		\
		$(COMMON_DATA_SRCS)		\
		$(COMMON_EXCEPTIONS_SRCS)	\
		$(COMMON_MATHS_SRCS)		\
		$(COMMON_SCENE_SRCS)		\
		$(COMMON_TEXTURE_SRCS)		\
		$(COMMON_TIME_SRCS)

2D_SRCS=	$(COMMON_SRCS)		\
		$(2D_CORE_SRCS)		\
		$(2D_DRAWABLE_SRCS)	\
		$(2D_SCENE_SRCS)

3D_SRCS=	$(COMMON_SRCS)		\
		$(3D_ENUMS_SRCS)	\
		$(3D_INTERFACES_SRCS)	\
		$(3D_CAMERA_SRCS)	\
		$(3D_CORE_SRCS)		\
		$(3D_EXCEPTIONS_SRCS)	\
		$(3D_LIGHT_SRCS)	\
		$(3D_MESH_SRCS)		\
		$(3D_RENDER_SRCS)	\
		$(3D_SCENE_SRCS)	\
		$(3D_SHADER_SRCS)	\
		$(3D_TEXTURE_SRCS)



all:		$(3DLIBFILE) $(2DLIBFILE)

$(2DLIBFILE):	$(2D_SRCS)
		$(CC) $(2D_SRCS) > $(2DLIBFILE)

$(3DLIBFILE):	$(3D_SRCS)
		$(CC) $(3D_SRCS) > $(3DLIBFILE)

clean:

fclean:		clean
		$(RM) $(2DLIBFILE) $(3DLIBFILE)

re:		fclean all
