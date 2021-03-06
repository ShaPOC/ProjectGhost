# 
# Copyright (C) 2006-2011 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=twisted
PKG_VERSION:=11.1.0
PKG_RELEASE:=1

PKG_SOURCE:=Twisted-$(PKG_VERSION).tar.bz2
PKG_SOURCE_URL:=http://twistedmatrix.com/Releases/Twisted/11.1/
PKG_MD5SUM:=972f3497e6e19318c741bf2900ffe31c

PKG_BUILD_DIR:=$(BUILD_DIR)/Twisted-$(PKG_VERSION)
PKG_BUILD_DEPENDS:=python USE_UCLIBC:librpc

include $(INCLUDE_DIR)/package.mk
$(call include_mk, python-package.mk)

define Package/twisted/default
  SUBMENU:=Python
  SECTION:=lang
  CATEGORY:=Languages
  URL:=http://twistedmatrix.com/
  DEPENDS:=+python-mini
endef

define Package/twisted/default/description
 Twisted is a networking engine written in Python, supporting numerous 
 protocols. It contains a web server, numerous chat clients, chat servers, 
 mail servers, and more.
endef

define Package/twisted
$(call Package/twisted/default)
  TITLE:=Python networking engine
  DEPENDS+= +zope-interface
endef

define Build/Compile
	$(call Build/Compile/PyMod,., install --prefix="/usr" --root="$(PKG_INSTALL_DIR)" )
	$(SED) 's,#!$(PYTHON),#!/usr/bin/python,' $(PKG_INSTALL_DIR)/usr/bin/*
endef

define Package/twisted/install
	$(INSTALL_DIR) $(1)$(PYTHON_PKG_DIR)
	$(CP) \
	    $(PKG_INSTALL_DIR)$(PYTHON_PKG_DIR)/* \
	    $(1)$(PYTHON_PKG_DIR)
    $(CP) \
    $(PKG_INSTALL_DIR)/usr/bin/* \ $(1)/usr/bin/
endef

$(eval $(call BuildPackage,twisted))
