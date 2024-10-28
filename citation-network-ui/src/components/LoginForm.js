// // Generated by Framer (cf240c2)
// import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import {
//   addFonts,
//   cx,
//   getFonts,
//   RichText,
//   useLocaleInfo,
//   useVariantState,
//   withCSS,
// } from "framer";
// import { LayoutGroup, motion, MotionConfigContext } from "framer-motion";
// import * as React from "react";
// import Button2 from "https://framerusercontent.com/modules/vi25RLfc8rQFQmRxDn9V/c2VnfF7cw2vmaRJ3Z4ee/RspIdx67S.js";
// import { TextField, InputAdornment, IconButton } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { Link as MuiLink } from "@mui/material";
// import { Link } from "react-router-dom";

// const Button2Fonts = getFonts(Button2);
// const serializationHash = "framer-CqmsT";
// const variantClassNames = { j74_WT4cw: "framer-v-1h1bxly" };

// function addPropertyOverrides(overrides, ...variants) {
//   const nextOverrides = {};
//   variants === null || variants === void 0
//     ? void 0
//     : variants.forEach(
//         (variant) => variant && Object.assign(nextOverrides, overrides[variant])
//       );
//   return nextOverrides;
// }

// const transition1 = { bounce: 0.2, delay: 0, duration: 0.4, type: "spring" };
// const transformTemplate1 = (_, t) => `translateX(-50%) ${t}`;
// const transformTemplate2 = (_, t) => `translate(-50%, -50%) ${t}`;

// const Transition = ({ value, children }) => {
//   const config = React.useContext(MotionConfigContext);
//   const transition =
//     value !== null && value !== void 0 ? value : config.transition;
//   const contextValue = React.useMemo(
//     () => ({ ...config, transition }),
//     [JSON.stringify(transition)]
//   );
//   return /*#__PURE__*/ _jsx(MotionConfigContext.Provider, {
//     value: contextValue,
//     children: children,
//   });
// };

// const Variants = motion.create(motion.div);

// const getProps = ({ height, id, width, ...props }) => {
//   return { ...props };
// };

// const createLayoutDependency = (props, variants) => {
//   if (props.layoutDependency)
//     return variants.join("-") + props.layoutDependency;
//   return variants.join("-");
// };

// const Component = /*#__PURE__*/ React.forwardRef(function (props, ref) {
//   const { activeLocale, setLocale } = useLocaleInfo();
//   const { style, className, layoutId, variant, ...restProps } = getProps(props);
//   const {
//     baseVariant,
//     classNames,
//     clearLoadingGesture,
//     gestureHandlers,
//     gestureVariant,
//     isLoading,
//     setGestureState,
//     setVariant,
//     variants,
//   } = useVariantState({
//     defaultVariant: "j74_WT4cw",
//     variant,
//     variantClassNames,
//   });
//   const layoutDependency = createLayoutDependency(props, variants);
//   const ref1 = React.useRef(null);
//   const defaultLayoutId = React.useId();
//   const sharedStyleClassNames = [];
//   const [showPassword, setShowPassword] = React.useState(false);

//   const handleClickShowPassword = () => {
//     setShowPassword((prev) => !prev);
//   };

//   return /*#__PURE__*/ _jsx(LayoutGroup, {
//     id: layoutId !== null && layoutId !== void 0 ? layoutId : defaultLayoutId,
//     children: /*#__PURE__*/ _jsx(Variants, {
//       animate: variants,
//       initial: false,
//       children: /*#__PURE__*/ _jsx(Transition, {
//         value: transition1,
//         children: /*#__PURE__*/ _jsxs(motion.div, {
//           ...restProps,
//           ...gestureHandlers,
//           className: cx(
//             serializationHash,
//             ...sharedStyleClassNames,
//             "framer-1h1bxly",
//             className,
//             classNames
//           ),
//           "data-framer-name": "Variant 1",
//           layoutDependency: layoutDependency,
//           layoutId: "j74_WT4cw",
//           ref: ref !== null && ref !== void 0 ? ref : ref1,
//           style: { backgroundColor: "rgb(255, 255, 255)", ...style },
//           children: [
//             /*#__PURE__*/ _jsxs(motion.label, {
//               className: "framer-12e4d50",
//               layoutDependency: layoutDependency,
//               layoutId: "ThXOJqsQp",
//               transformTemplate: transformTemplate1,
//               children: [
//                 /*#__PURE__*/ _jsx(RichText, {
//                   __fromCanvasComponent: true,
//                   children: /*#__PURE__*/ _jsx(React.Fragment, {
//                     children: /*#__PURE__*/ _jsx(motion.p, {
//                       style: {
//                         "--font-selector": "SW50ZXItTWVkaXVt",
//                         "--framer-font-family":
//                           '"Inter", "Inter Placeholder", sans-serif',
//                         "--framer-font-size": "12px",
//                         "--framer-font-weight": "500",
//                         "--framer-text-color":
//                           "var(--extracted-r6o4lv, rgb(136, 136, 136))",
//                       },
//                       children: "Email",
//                     }),
//                   }),
//                   className: "framer-2uin2k",
//                   fonts: ["Inter-Medium"],
//                   layoutDependency: layoutDependency,
//                   layoutId: "E8zNjK7sq",
//                   style: { "--extracted-r6o4lv": "rgb(136, 136, 136)" },
//                   verticalAlignment: "top",
//                   withExternalLayout: true,
//                 }),
//                 /*#__PURE__*/ _jsx(TextField, {
//                   className: "framer-176k2yi",
//                   name: "email",
//                   type: "email",
//                   placeholder: "JaneSmith@gmail.com",
//                   required: true,
//                   fullWidth: true,
//                   variant: "outlined",
//                   sx: {
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: '10px',
//                       backgroundColor: 'rgba(187, 187, 187, 0.15)',
//                     }
//                   }
//                 }),
//               ],
//             }),
//             /*#__PURE__*/ _jsxs(motion.label, {
//               className: "framer-vltjum",
//               layoutDependency: layoutDependency,
//               layoutId: "fF7IXmtie",
//               transformTemplate: transformTemplate2,
//               children: [
//                 /*#__PURE__*/ _jsx(RichText, {
//                   __fromCanvasComponent: true,
//                   children: /*#__PURE__*/ _jsx(React.Fragment, {
//                     children: /*#__PURE__*/ _jsx(motion.p, {
//                       style: {
//                         "--font-selector": "SW50ZXItTWVkaXVt",
//                         "--framer-font-family":
//                           '"Inter", "Inter Placeholder", sans-serif',
//                         "--framer-font-size": "12px",
//                         "--framer-font-weight": "500",
//                         "--framer-text-color":
//                           "var(--extracted-r6o4lv, rgb(136, 136, 136))",
//                       },
//                       children: "Password",
//                     }),
//                   }),
//                   className: "framer-ctqzc",
//                   fonts: ["Inter-Medium"],
//                   layoutDependency: layoutDependency,
//                   layoutId: "EJGOma18J",
//                   style: { "--extracted-r6o4lv": "rgb(136, 136, 136)" },
//                   verticalAlignment: "top",
//                   withExternalLayout: true,
//                 }),
//                 /*#__PURE__*/ _jsx(TextField, {
//                   className: "framer-1wrtsie",
//                   name: "password",
//                   type: showPassword ? "text" : "password",
//                   placeholder: "Enter your password",
//                   required: true,
//                   fullWidth: true,
//                   variant: "outlined",
//                   InputProps={{
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton onClick={handleClickShowPassword} edge="end">
//                           {showPassword ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                   sx: {
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: '10px',
//                       backgroundColor: 'rgba(187, 187, 187, 0.15)',
//                     }
//                   }
//                 }),
//               ],
//             }),
//             /*#__PURE__*/ _jsx(motion.div, {
//               className: "framer-5fpazc-container",
//               layoutDependency: layoutDependency,
//               layoutId: "qynH2hSOl-container",
//               style: { position: 'absolute', bottom: '78px', width: '100%', height: '40px' },
//               children: /*#__PURE__*/ _jsx(Button2, {
//                 height: "100%",
//                 id: "qynH2hSOl",
//                 layoutId: "qynH2hSOl",
//                 style: { height: "100%", width: "100%" },
//                 variant: "GaJQWgpi6",
//                 width: "100%",
//               }),
//             }),
//             /*#__PURE__*/ _jsx(RichText, {
//               __fromCanvasComponent: true,
//               children: /*#__PURE__*/ _jsx(React.Fragment, {
//                 children: /*#__PURE__*/ _jsx(motion.p, {
//                   style: {
//                     "--font-selector": "R0Y7T3BlbiBTYW5zLTUwMA==",
//                     "--framer-font-family":
//                       '"Open Sans", "Open Sans Placeholder", sans-serif',
//                     "--framer-font-size": "25px",
//                     "--framer-font-weight": "500",
//                     "--framer-text-alignment": "center",
//                     "--framer-text-color":
//                       "var(--extracted-r6o4lv, rgb(77, 47, 47))",
//                   },
//                   children: "Log in to your account",
//                 }),
//               }),
//               className: "framer-nkxcol",
//               fonts: ["GF;Open Sans-500"],
//               layoutDependency: layoutDependency,
//               layoutId: "FrKZ3XsS2",
//               style: { "--extracted-r6o4lv": "rgb(77, 47, 47)" },
//               transformTemplate: transformTemplate1,
//               verticalAlignment: "top",
//               withExternalLayout: true,
//             }),
//             /*#__PURE__*/ _jsx(RichText, {
//               __fromCanvasComponent: true,
//               children: /*#__PURE__*/ _jsx(React.Fragment, {
//                 children: /*#__PURE__*/ _jsx(motion.p, {
//                   style: {
//                     "--font-selector": "SW50ZXItTWVkaXVt",
//                     "--framer-font-family":
//                       '"Inter", "Inter Placeholder", sans-serif',
//                     "--framer-font-size": "22px",
//                     "--framer-font-weight": "500",
//                     "--framer-text-alignment": "center",
//                     "--framer-text-color":
//                       "var(--extracted-r6o4lv, rgb(77, 47, 47))",
//                   },
//                   children: (
//                     <>
//                       Don't have an account?{' '}
//                       <MuiLink component={Link} to="/signup" color="primary">
//                         Sign Up
//                       </MuiLink>
//                     </>
//                   ),
//                 }),
//               }),
//               className: "framer-19i7ws9",
//               fonts: ["Inter-Medium"],
//               layoutDependency: layoutDependency,
//               layoutId: "bItdHCYt3",
//               style: { "--extracted-r6o4lv": "rgb(77, 47, 47)" },
//               transformTemplate: transformTemplate1,
//               verticalAlignment: "top",
//               withExternalLayout: true,
//             }),
//           ],
//         }),
//       }),
//     }),
//   });
// });

// const css = [
//   "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
//   ".framer-CqmsT.framer-nphym3, .framer-CqmsT .framer-nphym3 { display: block; }",
//   ".framer-CqmsT.framer-1h1bxly { height: 421px; position: relative; width: 397px; }",
//   ".framer-CqmsT .framer-12e4d50 { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: flex-start; left: 46%; padding: 0px; position: absolute; top: 105px; width: 1fr; }",
//   ".framer-CqmsT .framer-2uin2k, .framer-CqmsT .framer-ctqzc { flex: none; height: auto; position: relative; white-space: pre; width: auto; }",
//   '.framer-CqmsT .framer-176k2yi, .framer-CqmsT .framer-1wrtsie { flex: none; height: 40px; position: relative; width: 100%; }',
//   ".framer-CqmsT .framer-vltjum { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: flex-start; left: 46%; padding: 0px; position: absolute; top: 52%; width: 1fr; }",
//   ".framer-CqmsT .framer-5fpazc-container { bottom: 78px; flex: none; height: 40px; left: calc(45.59193954659952% - 1fr / 2); position: absolute; width: 1fr; }",
//   ".framer-CqmsT .framer-nkxcol { flex: none; height: auto; left: 46%; position: absolute; top: 42px; white-space: pre; width: auto; }",
//   ".framer-CqmsT .framer-19i7ws9 { bottom: 18px; flex: none; height: auto; left: 50%; position: absolute; white-space: pre; width: auto; }",
//   "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-CqmsT .framer-12e4d50, .framer-CqmsT .framer-vltjum { gap: 0px; } .framer-CqmsT .framer-12e4d50 > *, .framer-CqmsT .framer-vltjum > * { margin: 0px; margin-bottom: calc(10px / 2); margin-top: calc(10px / 2); } .framer-CqmsT .framer-12e4d50 > :first-child, .framer-CqmsT .framer-vltjum > :first-child { margin-top: 0px; } .framer-CqmsT .framer-12e4d50 > :last-child, .framer-CqmsT .framer-vltjum > :last-child { margin-bottom: 0px; } }",
// ];

// const LoginForm = withCSS(Component, css, "framer-CqmsT");
// export default LoginForm;
// LoginForm.displayName = "login form";
// LoginForm.defaultProps = { height: 421, width: 397 };
// addFonts(LoginForm, [
//   {
//     explicitInter: true,
//     fonts: [
//       // ... font configurations (kept the same)
//     ],
//   },
//   ...Button2Fonts,
// ], { supportsExplicitInterCodegen: true });

// export const __FramerMetadata__ = {
//   exports: {
//     default: {
//       type: "reactComponent",
//       name: "LoginForm",
//       slots: [],
//       annotations: {
//         framerCanvasComponentVariantDetails:
//           '{"propertyName":"variant","data":{"default":{"layout":["fixed","fixed"]}}}',
//         framerIntrinsicHeight: "421",
//         framerImmutableVariables: "true",
//         framerDisplayContentsDiv: "false",
//         framerContractVersion: "1",
//         framerIntrinsicWidth: "397",
//         framerComponentViewportWidth: "true",
//       },
//     },
//     Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
//     __FramerMetadata__: { type: "variable" },
//   },
// };