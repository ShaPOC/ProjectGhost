# 
# Copyright (C) 2006-2011 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=twisted.web
PKG_VERSION:=11.1.0
PKG_RELEASE:=1

PKG_SOURCE:=TwistedWeb-$(PKG_VERSION).tar.bz2
PKG_SOURCE_URL:=http://twistedmatrix.com/Releases/Web/11.1/
PKG_MD5SUM:=60f579e9d6ef01e0fa8ef146b5ca1b2e

PKG_BUILD_DIR:=$(BUILD_DIR)/TwistedWeb-$(PKG_VERSION)
PKG_BUILD_DEPENDS:=python USE_UCLIBC:librpc

include $(INCLUDE_DIR)/package.mk
$(call include_mk, python-package.mk)

define Package/twisted-web/default
  SUBMENU:=Python
  SECTION:=lang
  CATEGORY:=Languages
  URL:=http://twistedmatrix.com/
  DEPENDS:=+python-mini
endef

define Package/twisted-web/default/description
 Twisted is a networking engine written in Python, supporting numerous 
 protocols. It contains a web server, numerous chat clients, chat servers, 
 mail servers, and more.
endef

define Package/twisted-web
$(call Package/twisted-web/default)
  TITLE:=Python networking engine
  DEPENDS+= +twisted
endef

define Build/Compile
	$(call Build/Compile/PyMod,., install --prefix="/usr" --root="$(PKG_INSTALL_DIR)" )
endef

define Package/twisted-web/install
	$(INSTALL_DIR) $(1)$(PYTHON_PKG_DIR)
	$(CP) \
	    $(PKG_INSTALL_DIR)$(PYTHON_PKG_DIR)/* \
	    $(1)$(PYTHON_PKG_DIR)
endef

$(eval $(call BuildPackage,twisted-web))
