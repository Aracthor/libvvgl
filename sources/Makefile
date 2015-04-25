##
## Makefile for vvgl in /home/aracthor/programs/projects/vvgl/sources
## 
## Made by aracthor
## Login   <aracthor@epitech.net>
## 
## Started on  Sat Apr 11 09:31:12 2015 aracthor
## Last Update Sat Apr 25 22:22:39 2015 aracthor
##

CC=		cat

# Lib made
NAME=		vvgl
FILENAME=	lib$(NAME).js
LIBPATH=	../
LIBFILE=	$(LIBPATH)$(FILENAME)

CAMERA_DIR=	camera/
CAMERA_FILES=	Camera.js		\
		FreeFlyCamera.js	\
		TrackballCamera.js
CAMERA_SRCS=	$(CAMERA_FILES:%.js=$(CAMERA_DIR)%.js)

CORE_DIR=	core/
CORE_FILES=	Application.js	\
		core.js
CORE_SRCS=	$(CORE_FILES:%.js=$(CORE_DIR)%.js)

DATA_DIR=	data/
DATA_FILES=	Color.js	\
		Map.js
DATA_SRCS=	$(DATA_FILES:%.js=$(DATA_DIR)%.js)

EVENTS_DIR=	events/
EVENTS_FILES=	EventsManager.js	\
		EventsHandler.js	\
		Keyboard.js		\
		KeyEventListener.js	\
		Mouse.js		\
		MouseMovementListener.js
EVENTS_SRCS=	$(EVENTS_FILES:%.js=$(EVENTS_DIR)%.js)

EXCEPTIONS_DIR=		exceptions/
EXCEPTIONS_FILES=	Exception.js			\
			GLErrorException.js		\
			GLRessourceException.js		\
			ImplementationException.js
EXCEPTIONS_SRCS=	$(EXCEPTIONS_FILES:%.js=$(EXCEPTIONS_DIR)%.js)

ENUMS_DIR=	enums/
ENUMS_FILES=	KeyCode.js	\
		MouseButton.js	\
		RenderMode.js
ENUMS_SRCS=	$(ENUMS_FILES:%.js=$(ENUMS_DIR)%.js)

INTERFACES_DIR=		interfaces/
INTERFACES_FILES=	IBindable.js	\
			SceneData.js
INTERFACES_SRCS=	$(INTERFACES_FILES:%.js=$(INTERFACES_DIR)%.js)

MATHS_DIR=	maths/
MATHS_FILES=	Mat4.js		\
		Maths.js	\
		Vec3.js
MATHS_SRCS=	$(MATHS_FILES:%.js=$(MATHS_DIR)%.js)

MESH_DIR=	mesh/
MESH_FILES=	ArrayBuffer.js	\
		Mesh.js
MESH_SRCS=	$(MESH_FILES:%.js=$(MESH_DIR)%.js)

RENDER_DIR=	render/
RENDER_FILES=	Renderer.js	\
		Shader.js	\
		ShaderProgram.js
RENDER_SRCS=	$(RENDER_FILES:%.js=$(RENDER_DIR)%.js)

SCENE_DIR=	scene/
SCENE_FILES=	Scene.js	\
		SceneManager.js	\
		SceneNode.js
SCENE_SRCS=	$(SCENE_FILES:%.js=$(SCENE_DIR)%.js)

SUPERVISORS_DIR=	supervisors/
SUPERVISORS_FILES=	MatrixSupervisor.js	\
			ModelMatrix.js		\
			PerspectiveMatrix.js	\
			ViewMatrix.js
SUPERVISORS_SRCS=	$(SUPERVISORS_FILES:%.js=$(SUPERVISORS_DIR)%.js)

TIME_DIR=	time/
TIME_FILES=	Clock.js
TIME_SRCS=	$(TIME_FILES:%.js=$(TIME_DIR)%.js)


SRCS=	namespace.js		\
	$(ENUMS_SRCS)		\
	$(INTERFACES_SRCS)	\
	$(EVENTS_SRCS)		\
	$(CORE_SRCS)		\
	$(CAMERA_SRCS)		\
	$(DATA_SRCS)		\
	$(EXCEPTIONS_SRCS)	\
	$(MATHS_SRCS)		\
	$(MESH_SRCS)		\
	$(RENDER_SRCS)		\
	$(SCENE_SRCS)		\
	$(TIME_SRCS)		\
#	$(SUPERVISORS_SRCS)



$(LIBFILE):	$(SRCS)
		$(CC) $(SRCS) > $(LIBFILE)

all:		$(LIBFILE)

clean:

fclean:		clean
		$(RM) $(LIBFILE)

re:		fclean all
