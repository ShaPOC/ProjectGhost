#
# Copyright (C) 2008-2010 OpenWrt.org
#
# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=zope.interface
PKG_VERSION:=3.8.0
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=http://pypi.python.org/packages/source/z/zope.interface/
PKG_MD5SUM:=8ab837320b4532774c9c89f030d2a389

PKG_BUILD_DEPENDS:=python

include $(INCLUDE_DIR)/package.mk
$(call include_mk, python-package.mk)

define Package/zope-interface
  SUBMENU:=Python
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=zope.interface
  URL:=http://docs.zope.org/zope.interface
  DEPENDS:=+python
endef

define Package/zope-interface/description
  This package provides an implementation of "object interfaces" for Python.
  Interfaces are a mechanism for labeling objects as conforming to a give
  API or contract. So, this package can be considered as implementation of
  the Design By Contract methodology support in Python.
endef

define Build/Compile
	$(call Build/Compile/PyMod,,install --prefix="$(PKG_INSTALL_DIR)/usr")
endef

define Package/zope-interface/install
	$(INSTALL_DIR) $(1)$(PYTHON_PKG_DIR)
	$(CP) \
	    $(PKG_INSTALL_DIR)$(PYTHON_PKG_DIR)/* \
	    $(1)$(PYTHON_PKG_DIR)
endef

$(eval $(call BuildPackage,zope-interface))